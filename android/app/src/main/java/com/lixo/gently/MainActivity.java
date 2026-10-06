package com.lixo.gently;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.lixo.gently.callguard.CallGuardPlugin;
import com.lixo.gently.callguard.ContactPickerPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(CallGuardPlugin.class);
        registerPlugin(ContactPickerPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
