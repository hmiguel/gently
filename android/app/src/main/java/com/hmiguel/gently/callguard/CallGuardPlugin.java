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

    private boolean hasRole() {
        RoleManager rm = getContext().getSystemService(RoleManager.class);
        return rm != null && rm.isRoleHeld(RoleManager.ROLE_CALL_REDIRECTION);
    }

    @PluginMethod
    public void capabilities(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("blockOutgoing", true);
        ret.put("blockIncoming", false);
        call.resolve(ret);
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        RuleStore store = store();
        JSObject ret = new JSObject();
        ret.put("hasPermission", hasRole());
        ret.put("enabled", store.isEnabled());
        ret.put("mode", store.getMode());
        ret.put("numbers", toJSArray(store.getNumbers()));
        call.resolve(ret);
    }

    @PluginMethod
    public void setRules(PluginCall call) {
        String mode = call.getString("mode", RuleStore.MODE_BLOCKLIST);
        if (!RuleStore.MODE_ALL.equals(mode) && !RuleStore.MODE_BLOCKLIST.equals(mode)
            && !RuleStore.MODE_ALLOWLIST.equals(mode)) {
            call.reject("Unknown mode: " + mode);
            return;
        }
        JSArray numbers = call.getArray("numbers", new JSArray());
        store().save(Boolean.TRUE.equals(call.getBoolean("enabled", false)), mode, numbers);
        getStatus(call);
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (hasRole()) {
            getStatus(call);
            return;
        }
        RoleManager rm = getContext().getSystemService(RoleManager.class);
        if (rm == null || !rm.isRoleAvailable(RoleManager.ROLE_CALL_REDIRECTION)) {
            call.reject("Call redirection is not available on this device");
            return;
        }
        Intent intent = rm.createRequestRoleIntent(RoleManager.ROLE_CALL_REDIRECTION);
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
