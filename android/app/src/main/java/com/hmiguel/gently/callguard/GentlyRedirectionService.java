package com.hmiguel.gently.callguard;

import android.net.Uri;
import android.telecom.CallRedirectionService;
import android.telecom.PhoneAccountHandle;
import android.telephony.TelephonyManager;

import androidx.annotation.NonNull;

/**
 * Called by Android for every outgoing call, from any dialer, once Gently holds
 * the call-redirection role. Emergency calls never reach this service, but we
 * double-check anyway.
 */
public class GentlyRedirectionService extends CallRedirectionService {

    @Override
    public void onPlaceCall(@NonNull Uri handle, @NonNull PhoneAccountHandle initialPhoneAccount,
                            boolean allowInteractiveResponse) {
        String number = handle.getSchemeSpecificPart();
        RuleStore store = new RuleStore(this);

        if (!isEmergency(number) && store.shouldBlockOutgoing(number)) {
            store.appendLog(number, RuleStore.OUT);
            cancelCall();
        } else {
            placeCallUnmodified();
        }
    }

    private boolean isEmergency(String number) {
        TelephonyManager tm = getSystemService(TelephonyManager.class);
        try {
            return tm != null && tm.isEmergencyNumber(number);
        } catch (RuntimeException e) {
            // Fail open: never risk blocking an emergency call.
            return true;
        }
    }
}
