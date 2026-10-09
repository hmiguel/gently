package com.lixo.gently.callguard;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.UUID;

/**
 * Blocking rules and the blocked-call log, shared between the UI plugin and the
 * call services. Lives in native SharedPreferences so the services can read it
 * while the app (and its WebView) is closed.
 *
 * <p>A rule is {@code {id, action, direction, target, number?, label?, schedule?}}:
 * <ul>
 *   <li>action: "block" | "allow"</li>
 *   <li>direction: "outgoing" | "incoming" | "both"</li>
 *   <li>target: "number" (one number) | "anyone" | "international" (outside the SIM's
 *       country) | "hidden" (incoming, no caller ID)</li>
 *   <li>schedule: {@code {from, until}} as local "HH:mm"; the rule only applies from
 *       {@code from} (inclusive) to {@code until} (exclusive), crossing midnight when
 *       {@code from} is later. Without one (or with from == until) it always applies.</li>
 * </ul>
 * For a given call, the most specific matching active rule wins: number or hidden, then
 * international, then anyone. On a tie, block wins.
 */
public final class RuleStore {
    public static final String OUTGOING = "outgoing";
    public static final String INCOMING = "incoming";
    public static final String BOTH = "both";

    public static final String BLOCK = "block";
    public static final String ALLOW = "allow";

    public static final String TARGET_NUMBER = "number";
    public static final String TARGET_ANYONE = "anyone";
    public static final String TARGET_HIDDEN = "hidden";
    public static final String TARGET_INTERNATIONAL = "international";

    /** Log entry directions. */
    public static final String OUT = "out";
    public static final String IN = "in";

    private static final String PREFS = "gently.callguard";
    private static final String KEY_ENABLED = "enabled";
    private static final String KEY_RULES = "rules";
    private static final String KEY_LOG = "log";
    private static final int LOG_LIMIT = 200;

    private final Context context;
    private final SharedPreferences prefs;

    public RuleStore(Context context) {
        this.context = context.getApplicationContext();
        prefs = this.context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        migrateLegacy();
    }

    public boolean isEnabled() {
        return prefs.getBoolean(KEY_ENABLED, false);
    }

    public JSONArray getRules() {
        return parseArray(prefs.getString(KEY_RULES, "[]"));
    }

    public void save(boolean enabled, JSONArray rules) {
        prefs.edit()
            .putBoolean(KEY_ENABLED, enabled)
            .putString(KEY_RULES, rules.toString())
            .apply();
    }

    /**
     * Whether any rule needs the given call direction intercepted. Scheduled rules count
     * all day: the OS has to keep routing calls here for when their window opens.
     */
    public boolean needs(String direction) {
        JSONArray rules = getRules();
        for (int i = 0; i < rules.length(); i++) {
            JSONObject rule = rules.optJSONObject(i);
            if (rule != null && covers(rule.optString("direction"), direction)) return true;
        }
        return false;
    }

    public boolean shouldBlockOutgoing(String number) {
        return shouldBlock(OUTGOING, number);
    }

    /** A null/empty number is a hidden caller. */
    public boolean shouldBlockIncoming(String number) {
        return shouldBlock(INCOMING, number);
    }

    private boolean shouldBlock(String direction, String number) {
        Calendar now = Calendar.getInstance();
        return shouldBlock(direction, number, now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE));
    }

    /** {@code minuteOfDay} is local time, 0..1439. */
    boolean shouldBlock(String direction, String number, int minuteOfDay) {
        if (!isEnabled()) return false;
        boolean hidden = number == null || digits(number).isEmpty();
        // Only worked out if an international rule applies to this direction.
        Boolean international = null;

        int bestRank = -1;
        boolean block = false;
        JSONArray rules = getRules();
        for (int i = 0; i < rules.length(); i++) {
            JSONObject rule = rules.optJSONObject(i);
            if (rule == null || !covers(rule.optString("direction"), direction)) continue;
            if (!activeAt(rule, minuteOfDay)) continue;

            if (international == null && TARGET_INTERNATIONAL.equals(rule.optString("target"))) {
                international = !hidden && International.isInternational(context, number);
            }
            int rank = matchRank(rule, number, hidden, Boolean.TRUE.equals(international));
            if (rank < 0) continue;
            boolean ruleBlocks = !ALLOW.equals(rule.optString("action"));
            if (rank > bestRank) {
                bestRank = rank;
                block = ruleBlocks;
            } else if (rank == bestRank) {
                block = block || ruleBlocks;
            }
        }
        return block;
    }

    /** -1 = no match; otherwise how specific the match is: anyone 0, international 1, number/hidden 2. */
    private static int matchRank(JSONObject rule, String number, boolean hidden, boolean international) {
        switch (rule.optString("target")) {
            case TARGET_ANYONE:
                return 0;
            case TARGET_INTERNATIONAL:
                return international ? 1 : -1;
            case TARGET_HIDDEN:
                return hidden ? 2 : -1;
            case TARGET_NUMBER:
                return !hidden && sameNumber(number, rule.optString("number")) ? 2 : -1;
            default:
                return -1;
        }
    }

    /** Whether the rule's schedule (if any) includes this local minute of the day. */
    static boolean activeAt(JSONObject rule, int minuteOfDay) {
        JSONObject schedule = rule.optJSONObject("schedule");
        if (schedule == null) return true;
        int from = minutes(schedule.optString("from"));
        int until = minutes(schedule.optString("until"));
        if (from < 0 || until < 0 || from == until) return true;
        return from < until
            ? minuteOfDay >= from && minuteOfDay < until
            : minuteOfDay >= from || minuteOfDay < until;
    }

    /** "HH:mm" to minutes since midnight; -1 if malformed. */
    private static int minutes(String hhmm) {
        String[] parts = hhmm.split(":");
        if (parts.length != 2) return -1;
        try {
            int h = Integer.parseInt(parts[0]);
            int m = Integer.parseInt(parts[1]);
            return h >= 0 && h < 24 && m >= 0 && m < 60 ? h * 60 + m : -1;
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private static boolean covers(String ruleDirection, String callDirection) {
        return BOTH.equals(ruleDirection) || callDirection.equals(ruleDirection);
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
            entries.add(new JSONObject()
                .put("number", number == null ? "" : number)
                .put("direction", direction)
                .put("at", System.currentTimeMillis()));
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

    /**
     * Converts the old single-setting format (mode + direction + blockHidden +
     * numbers) into rules, once.
     */
    private void migrateLegacy() {
        if (prefs.contains(KEY_RULES) || !prefs.contains("mode")) return;
        String mode = prefs.getString("mode", "blocklist");
        String direction = prefs.getString("direction", OUTGOING);
        JSONArray numbers = parseArray(prefs.getString("numbers", "[]"));
        JSONArray rules = new JSONArray();
        try {
            if (!"blocklist".equals(mode)) rules.put(rule(BLOCK, direction, TARGET_ANYONE, null, null));
            if (!"all".equals(mode)) {
                String action = "allowlist".equals(mode) ? ALLOW : BLOCK;
                for (int i = 0; i < numbers.length(); i++) {
                    JSONObject n = numbers.optJSONObject(i);
                    if (n != null) rules.put(rule(action, direction, TARGET_NUMBER, n.optString("number"), n.optString("label", null)));
                }
            }
            if (prefs.getBoolean("blockHidden", false) && !OUTGOING.equals(direction)) {
                rules.put(rule(BLOCK, INCOMING, TARGET_HIDDEN, null, null));
            }
        } catch (JSONException e) {
            return;
        }
        prefs.edit()
            .putString(KEY_RULES, rules.toString())
            .remove("mode").remove("direction").remove("blockHidden").remove("numbers")
            .apply();
    }

    private static JSONObject rule(String action, String direction, String target, String number, String label)
        throws JSONException {
        JSONObject rule = new JSONObject()
            .put("id", UUID.randomUUID().toString())
            .put("action", action)
            .put("direction", direction)
            .put("target", target);
        if (number != null) rule.put("number", number);
        if (label != null && !label.isEmpty()) rule.put("label", label);
        return rule;
    }

    private static JSONArray parseArray(String json) {
        try {
            return new JSONArray(json);
        } catch (JSONException e) {
            return new JSONArray();
        }
    }
}
