package com.hmiguel.gently.callguard;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assume.assumeTrue;

import android.content.Context;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

/** Runs on a device with a Portuguese SIM (+351); skipped elsewhere. No calls are placed. */
@RunWith(AndroidJUnit4.class)
public class InternationalTest {
    private Context context;

    @Before
    public void requirePortugueseSim() {
        context = InstrumentationRegistry.getInstrumentation().getTargetContext();
        assumeTrue("needs a PT SIM", "PT".equals(International.homeCountry(context)));
    }

    @Test
    public void domesticFormatsAreNotInternational() {
        assertFalse(International.isInternational(context, "912 345 678"));
        assertFalse(International.isInternational(context, "213009999"));
        assertFalse(International.isInternational(context, "+351 912 345 678"));
        assertFalse(International.isInternational(context, "00351912345678"));
    }

    @Test
    public void foreignNumbersAreInternational() {
        assertTrue(International.isInternational(context, "+44 20 7946 0000"));
        assertTrue(International.isInternational(context, "0044 20 7946 0000"));
        assertTrue(International.isInternational(context, "+34 912 345 678"));
        assertTrue(International.isInternational(context, "+1 212 555 0100"));
        assertTrue(International.isInternational(context, "+33612345678"));
    }

    @Test
    public void unknownNumbersAreNotInternational() {
        assertFalse(International.isInternational(context, null));
        assertFalse(International.isInternational(context, ""));
        assertFalse(International.isInternational(context, "112"));
    }
}
