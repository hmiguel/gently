package com.hmiguel.gently.callguard;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Blocking rules and the blocked-call log, shared between the UI plugin and the
 * redirection service. Lives in native SharedPreferences so the service can read
 * it while the app (and its WebView) is closed.
 */
public final class RuleStore {
    public static final String MODE_ALL = "all";
    public static final String MODE_BLOCKLIST = "blocklist";
    public static final String MODE_ALLOWLIST = "allowlist";

    public static final String DIRECTION_OUTGOING = "outgoing";
    public static final String DIRECTION_INCOMING = "incoming";
    public static final String DIRECTION_BOTH = "both";

    /** Log entry directions. */
    public static final String OUT = "out";
    public static final String IN = "in";

    private static final String PREFS = "gently.callguard";
    private static final String KEY_ENABLED = "enabled";
    private static final String KEY_MODE = "mode";
    private static final String KEY_NUMBERS = "numbers";
    private static final String KEY_DIRECTION = "direction";
    private static final String KEY_BLOCK_HIDDEN = "blockHidden";
    private static final String KEY_LOG = "log";
    private static final int LOG_LIMIT = 200;

    private final SharedPreferences prefs;

    public RuleStore(Context context) {
        prefs = context.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    public boolean isEnabled() {
        return prefs.getBoolean(KEY_ENABLED, false);
    }

    public String getMode() {
        return prefs.getString(KEY_MODE, MODE_BLOCKLIST);
    }

    public JSONArray getNumbers() {
        return parseArray(prefs.getString(KEY_NUMBERS, "[]"));
    }

    public String getDirection() {
        return prefs.getString(KEY_DIRECTION, DIRECTION_OUTGOING);
    }

    public boolean isBlockHidden() {
        return prefs.getBoolean(KEY_BLOCK_HIDDEN, false);
    }

    public void save(boolean enabled, String mode, String direction, boolean blockHidden, JSONArray numbers) {
        prefs.edit()
            .putBoolean(KEY_ENABLED, enabled)
            .putString(KEY_MODE, mode)
            .putString(KEY_DIRECTION, direction)
            .putBoolean(KEY_BLOCK_HIDDEN, blockHidden)
            .putString(KEY_NUMBERS, numbers.toString())
            .apply();
    }

    /** Decides whether an outgoing call to {@code number} must be cancelled. */
    public boolean shouldBlockOutgoing(String number) {
        return isEnabled() && !DIRECTION_INCOMING.equals(getDirection()) && matches(number);
    }

    /**
     * Decides whether an incoming call from {@code number} must be rejected.
     * A null/empty number is a hidden caller, governed only by blockHidden.
     */
    public boolean shouldBlockIncoming(String number) {
        if (!isEnabled() || DIRECTION_OUTGOING.equals(getDirection())) return false;
        if (number == null || digits(number).isEmpty()) return isBlockHidden();
        return matches(number);
    }

    private boolean matches(String number) {
        String mode = getMode();
        if (MODE_ALL.equals(mode)) return true;

        boolean listed = isListed(number);
        return MODE_ALLOWLIST.equals(mode) ? !listed : listed;
    }

    private boolean isListed(String number) {
        JSONArray numbers = getNumbers();
        for (int i = 0; i < numbers.length(); i++) {
            JSONObject entry = numbers.optJSONObject(i);
            if (entry != null && sameNumber(number, entry.optString("number"))) return true;
        }
        return false;
    }

    /**
     * Digits-only comparison that tolerates country prefixes: "+351 912 345 678"
     * matches "912345678". Requires at least 7 digits so short codes don't match
     * every number ending in them.
     */
    static boolean sameNumber(String a, String b) {
        String da = digits(a);
        String db = digits(b);
        if (da.isEmpty() || db.isEmpty()) return false;
        if (da.equals(db)) return true;
        String longer = da.length() >= db.length() ? da : db;
        String shorter = longer == da ? db : da;
        return shorter.length() >= 7 && longer.endsWith(shorter);
    }

    private static String digits(String s) {
        return s == null ? "" : s.replaceAll("[^0-9]", "");
    }

    public JSONArray getLog() {
        return parseArray(prefs.getString(KEY_LOG, "[]"));
    }

    public synchronized void appendLog(String number, String direction) {
        JSONArray log = getLog();
        List<JSONObject> entries = new ArrayList<>();
        try {
            entries.add(new JSONObject().put("number", number == null ? "" : number).put("direction", direction).put("at", System.currentTimeMillis()));
        } catch (JSONException ignored) {
            return;
        }
        for (int i = 0; i < log.length() && entries.size() < LOG_LIMIT; i++) {
            JSONObject entry = log.optJSONObject(i);
            if (entry != null) entries.add(entry);
        }
        prefs.edit().putString(KEY_LOG, new JSONArray(entries).toString()).apply();
    }

    public void clearLog() {
        prefs.edit().putString(KEY_LOG, "[]").apply();
    }

    private static JSONArray parseArray(String json) {
        try {
            return new JSONArray(json);
        } catch (JSONException e) {
            return new JSONArray();
        }
    }
}
