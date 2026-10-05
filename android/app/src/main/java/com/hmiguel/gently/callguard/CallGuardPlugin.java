package com.hmiguel.gently.callguard;

import android.Manifest;
import android.app.role.RoleManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.provider.Settings;
import android.util.Log;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.content.ContextCompat;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;
import org.json.JSONException;

/**
 * Bridge between the web UI and the native call-blocking rules. See src/plugins/callguard.ts.
 *
 * <p>Incoming blocking needs two grants: the call-screening role, and READ_CONTACTS.
 * Android does not pass calls from saved contacts to a screening app that can't
 * read contacts, so without it a rule for a contact would silently never fire.
 *
 * <p>Contacts is checked and requested with the plain Android APIs, not Capacitor's
 * annotation-based permission aliases: those are read by reflection and broke under
 * R8 in release builds (the request never returned).
 */
@CapacitorPlugin(name = "CallGuard")
public class CallGuardPlugin extends Plugin {
    private static final String TAG = "Gently";

    private ActivityResultLauncher<String> contactsLauncher;
    /** The requestPermission call waiting on the contacts prompt. */
    private PluginCall pendingContactsCall;

    @Override
    public void load() {
        // Must be registered while the activity is being created, which is when plugins load.
        contactsLauncher = getActivity().registerForActivityResult(
            new ActivityResultContracts.RequestPermission(), granted -> onContactsResult());
    }

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

    private boolean hasContacts() {
        return ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_CONTACTS)
            == PackageManager.PERMISSION_GRANTED;
    }

    private boolean hasIncoming() {
        return hasRole(RoleManager.ROLE_CALL_SCREENING) && hasContacts();
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
        permissions.put("incoming", hasIncoming());

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

    /**
     * Asks for what one direction needs: "outgoing" (role) or "incoming" (role,
     * then contacts). Resolves with the updated status either way.
     */
    @PluginMethod
    public void requestPermission(PluginCall call) {
        String role = roleFor(call.getString("direction", RuleStore.OUTGOING));
        Log.i(TAG, "requestPermission " + call.getString("direction") + " roleHeld=" + hasRole(role)
            + " contacts=" + hasContacts());
        if (hasRole(role)) {
            continueWithContacts(call);
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
        if (call == null) return;
        Log.i(TAG, "role result=" + result.getResultCode());
        if (hasRole(roleFor(call.getString("direction", RuleStore.OUTGOING)))) continueWithContacts(call);
        else getStatus(call);
    }

    /** Second step for incoming: the contacts permission. */
    private void continueWithContacts(PluginCall call) {
        if (!RuleStore.INCOMING.equals(call.getString("direction")) || hasContacts()) {
            getStatus(call);
            return;
        }
        pendingContactsCall = call;
        contactsLauncher.launch(Manifest.permission.READ_CONTACTS);
    }

    /**
     * If the prompt was refused, or never shown (Android and Xiaomi's permission manager stop
     * asking after a denial), the app's own permission screen is the only way left.
     */
    private void onContactsResult() {
        PluginCall call = pendingContactsCall;
        pendingContactsCall = null;
        if (call == null) return;
        Log.i(TAG, "contacts result granted=" + hasContacts());
        if (hasContacts()) getStatus(call);
        else openAppSettings(call);
    }

    private void openAppSettings(PluginCall call) {
        Log.i(TAG, "opening app settings for contacts");
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
            Uri.fromParts("package", getContext().getPackageName(), null));
        startActivityForResult(call, intent, "onSettingsResult");
    }

    @ActivityCallback
    private void onSettingsResult(PluginCall call, ActivityResult result) {
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
