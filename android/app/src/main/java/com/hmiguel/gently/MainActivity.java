package com.hmiguel.gently;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.hmiguel.gently.callguard.CallGuardPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(CallGuardPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
