package com.mediai.util;

import java.util.UUID;

public class CodeGenerator {

    public static String generatePatientCode() {
        return "PT" + System.currentTimeMillis();
    }

    public static String generatePrescriptionCode() {
        return "RX" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public static String generateMedicalRecordCode() {
        return "MR" + System.currentTimeMillis();
    }
}
