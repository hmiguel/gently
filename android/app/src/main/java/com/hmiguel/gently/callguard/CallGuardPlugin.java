package com.hmiguel.gently.callguard;

import android.app.role.RoleManager;
import android.content.Intent;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;
import org.json.JSONException;


/** Bridge between the web UI and the native call-blocking rules. See src/plugins/callguard.ts. */
@CapacitorPlugin(name = "CallGuard")
public class CallGuardPlugin extends Plugin {

    private RuleStore store() {
        return new RuleStore(getContext());
    }

    /** Outgoing blocking needs call redirection; incoming needs call screening. */
    private static String roleFor(String direction) {
        return RuleStore.INCOMING.equals(direction)
            ? RoleManager.ROLE_CALL_SCREENING
            : RoleManager.ROLE_CALL_REDIRECTION;
    }

    private boolean hasRole(String role) {
        RoleManager rm = getContext().getSystemService(RoleManager.class);
        return rm != null && rm.isRoleHeld(role);
    }

    @PluginMethod
    public void capabilities(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("blockOutgoing", true);
        ret.put("blockIncoming", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        RuleStore store = store();
        JSObject permissions = new JSObject();
        permissions.put("outgoing", hasRole(RoleManager.ROLE_CALL_REDIRECTION));
        permissions.put("incoming", hasRole(RoleManager.ROLE_CALL_SCREENING));

        JSObject ret = new JSObject();
        ret.put("permissions", permissions);
        ret.put("enabled", store.isEnabled());
        ret.put("rules", toJSArray(store.getRules()));
        call.resolve(ret);
    }

    /** Replaces the master switch and the whole rule list. Rule shape is documented in RuleStore. */
    @PluginMethod
    public void setRules(PluginCall call) {
        store().save(
            Boolean.TRUE.equals(call.getBoolean("enabled", false)),
            call.getArray("rules", new JSArray()));
        getStatus(call);
    }

    /** Asks for the role behind one direction: "outgoing" or "incoming". */
    @PluginMethod
    public void requestPermission(PluginCall call) {
        String role = roleFor(call.getString("direction", RuleStore.OUTGOING));
        if (hasRole(role)) {
            getStatus(call);
            return;
        }
        RoleManager rm = getContext().getSystemService(RoleManager.class);
        if (rm == null || !rm.isRoleAvailable(role)) {
            call.reject("This permission is not available on this device");
            return;
        }
        Intent intent = rm.createRequestRoleIntent(role);
        startActivityForResult(call, intent, "onRoleResult");
    }

    @ActivityCallback
    private void onRoleResult(PluginCall call, ActivityResult result) {
        if (call != null) getStatus(call);
    }

    @PluginMethod
    public void getLog(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("entries", toJSArray(store().getLog()));
        call.resolve(ret);
    }

    @PluginMethod
    public void clearLog(PluginCall call) {
        store().clearLog();
        call.resolve();
    }

    private static JSArray toJSArray(JSONArray array) {
        try {
            return new JSArray(array.toString());
        } catch (JSONException e) {
            return new JSArray();
        }
    }
}
