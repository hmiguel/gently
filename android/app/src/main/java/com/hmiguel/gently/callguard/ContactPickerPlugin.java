package com.hmiguel.gently.callguard;

import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.ContactsContract.CommonDataKinds.Phone;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Opens the system contact picker for a single phone number. The picker grants
 * temporary access to the chosen entry only, so no READ_CONTACTS permission is
 * needed and the rest of the address book stays private.
 */
@CapacitorPlugin(name = "ContactPicker")
public class ContactPickerPlugin extends Plugin {

    @PluginMethod
    public void pickPhone(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_PICK, Phone.CONTENT_URI);
        startActivityForResult(call, intent, "onPicked");
    }

    @ActivityCallback
    private void onPicked(PluginCall call, ActivityResult result) {
        if (call == null) return;

        JSObject ret = new JSObject();
        Uri uri = result.getData() == null ? null : result.getData().getData();
        if (result.getResultCode() != Activity.RESULT_OK || uri == null) {
            ret.put("contact", null);
            call.resolve(ret);
            return;
        }

        String[] projection = {Phone.NUMBER, Phone.DISPLAY_NAME};
        try (Cursor cursor = getContext().getContentResolver().query(uri, projection, null, null, null)) {
            if (cursor == null || !cursor.moveToFirst()) {
                call.reject("Could not read the selected contact");
                return;
            }
            JSObject contact = new JSObject();
            contact.put("number", cursor.getString(0));
            contact.put("name", cursor.getString(1));
            ret.put("contact", contact);
            call.resolve(ret);
        } catch (SecurityException e) {
            call.reject("Contact access was denied", e);
        }
    }
}
