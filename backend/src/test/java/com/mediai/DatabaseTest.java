package com.mediai;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.mediai.repository.*;

@SpringBootTest
public class DatabaseTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DrugRepository drugRepository;

    @Autowired
    private DrugInteractionRepository drugInteractionRepository;

    @Test
    public void testDatabaseCounts() {
        System.out.println("====== DATABASE DATA CHECK ======");
        System.out.println("Users count: " + userRepository.count());
        System.out.println("Patients count: " + patientRepository.count());
        System.out.println("Drugs count: " + drugRepository.count());
        System.out.println("Drug Interactions count: " + drugInteractionRepository.count());
        System.out.println("=================================");
    }
}
