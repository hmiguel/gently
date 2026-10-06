package com.lixo.gently.callguard;

import android.net.Uri;
import android.telecom.Call;
import android.telecom.CallScreeningService;

import androidx.annotation.NonNull;

/**
 * Called by Android for incoming calls once Gently holds the call-screening
 * role. Matching calls are rejected before the phone rings; they still appear
 * in the system call log so nothing is hidden from the user.
 */
public class GentlyScreeningService extends CallScreeningService {

    @Override
    public void onScreenCall(@NonNull Call.Details details) {
        if (details.getCallDirection() != Call.Details.DIRECTION_INCOMING) {
            respondToCall(details, new CallResponse.Builder().build());
            return;
        }

        Uri handle = details.getHandle();
        String number = handle == null ? null : handle.getSchemeSpecificPart();
        RuleStore store = new RuleStore(this);

        if (store.shouldBlockIncoming(number)) {
            store.appendLog(number, RuleStore.IN);
            respondToCall(details, new CallResponse.Builder()
                .setDisallowCall(true)
                .setRejectCall(true)
                .setSkipNotification(true)
                .build());
        } else {
            respondToCall(details, new CallResponse.Builder().build());
        }
    }
}
