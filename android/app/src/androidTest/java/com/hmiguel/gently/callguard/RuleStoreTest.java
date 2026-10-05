package com.hmiguel.gently.callguard;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assume.assumeTrue;

import android.content.Context;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

/** Rule precedence: number/hidden beat international, which beats anyone; block wins ties. */
@RunWith(AndroidJUnit4.class)
public class RuleStoreTest {
    private static final String MOM = "+351 912 000 101";
    private static final String UK = "+44 20 7946 0000";
    private static final String LOCAL = "213 000 404";

    private Context context;
    private RuleStore store;

    @Before
    public void setUp() {
        context = InstrumentationRegistry.getInstrumentation().getTargetContext();
        context.getSharedPreferences("gently.callguard", Context.MODE_PRIVATE).edit().clear().commit();
        store = new RuleStore(context);
    }

    private static JSONObject rule(String action, String direction, String target, String number) throws Exception {
        JSONObject r = new JSONObject().put("id", target + number).put("action", action)
            .put("direction", direction).put("target", target);
        if (number != null) r.put("number", number);
        return r;
    }

    private void save(JSONObject... rules) {
        JSONArray list = new JSONArray();
        for (JSONObject r : rules) list.put(r);
        store.save(true, list);
    }

    @Test
    public void nothingIsBlockedWhenSwitchedOff() throws Exception {
        save(rule("block", "both", "anyone", null));
        store.save(false, store.getRules());
        assertFalse(store.shouldBlockOutgoing(LOCAL));
        assertFalse(store.shouldBlockIncoming(LOCAL));
    }

    @Test
    public void allowedNumberBeatsBlockEveryone() throws Exception {
        save(rule("block", "outgoing", "anyone", null), rule("allow", "outgoing", "number", MOM));
        assertFalse(store.shouldBlockOutgoing("912000101"));
        assertTrue(store.shouldBlockOutgoing(LOCAL));
        assertFalse("outgoing rules don't touch incoming", store.shouldBlockIncoming(LOCAL));
    }

    @Test
    public void bothCoversIncomingAndOutgoing() throws Exception {
        save(rule("block", "both", "number", MOM));
        assertTrue(store.shouldBlockOutgoing(MOM));
        assertTrue(store.shouldBlockIncoming("+351912000101"));
    }

    @Test
    public void hiddenOnlyMatchesCallsWithoutNumber() throws Exception {
        save(rule("block", "incoming", "hidden", null));
        assertTrue(store.shouldBlockIncoming(null));
        assertTrue(store.shouldBlockIncoming(""));
        assertFalse(store.shouldBlockIncoming(LOCAL));
    }

    @Test
    public void internationalRules() throws Exception {
        assumeTrue("needs a PT SIM", "PT".equals(International.homeCountry(context)));
        save(rule("block", "outgoing", "international", null));
        assertTrue(store.shouldBlockOutgoing(UK));
        assertFalse(store.shouldBlockOutgoing(LOCAL));
        assertFalse(store.shouldBlockOutgoing(MOM));
    }

    @Test
    public void allowedForeignNumberBeatsBlockInternational() throws Exception {
        assumeTrue("needs a PT SIM", "PT".equals(International.homeCountry(context)));
        save(rule("block", "both", "international", null), rule("allow", "both", "number", UK));
        assertFalse(store.shouldBlockOutgoing(UK));
        assertTrue(store.shouldBlockIncoming("+34 912 345 678"));
    }

    @Test
    public void allowInternationalBeatsBlockEveryone() throws Exception {
        assumeTrue("needs a PT SIM", "PT".equals(International.homeCountry(context)));
        save(rule("block", "outgoing", "anyone", null), rule("allow", "outgoing", "international", null));
        assertFalse(store.shouldBlockOutgoing(UK));
        assertTrue(store.shouldBlockOutgoing(LOCAL));
    }
}
