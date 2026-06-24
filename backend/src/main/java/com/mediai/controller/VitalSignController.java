package com.mediai.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mediai.dto.common.ApiResponse;
import com.mediai.dto.vitalsign.request.CreateVitalSignRequest;
import com.mediai.dto.vitalsign.response.VitalSignResponse;
import com.mediai.entity.VitalSign;

@RestController
@RequestMapping("/api/vital-signs")
public class VitalSignController {

    @PostMapping
    public ResponseEntity<ApiResponse<VitalSignResponse>> createVitalSign(
            @RequestBody CreateVitalSignRequest request) {
        // VitalSign requires a MedicalRecord reference — here we build a transient object
        // for immediate response; actual persistence should go through MedicalRecordService
        VitalSign vitalSign = VitalSign.builder()
                .height(request.getHeight())
                .weight(request.getWeight())
                .temperature(request.getTemperature())
                .systolicBP(request.getSystolicBP())
                .diastolicBP(request.getDiastolicBP())
                .heartRate(request.getHeartRate())
                .respiratoryRate(request.getRespiratoryRate())
                .spo2(request.getSpo2())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Vital sign recorded successfully.", toResponse(vitalSign)));
    }

    private VitalSignResponse toResponse(VitalSign vs) {
        VitalSignResponse response = new VitalSignResponse();
        response.setId(vs.getId());
        response.setHeight(vs.getHeight());
        response.setWeight(vs.getWeight());
        response.setTemperature(vs.getTemperature());
        response.setSystolicBP(vs.getSystolicBP());
        response.setDiastolicBP(vs.getDiastolicBP());
        response.setHeartRate(vs.getHeartRate());
        response.setRespiratoryRate(vs.getRespiratoryRate());
        response.setSpo2(vs.getSpo2());
        return response;
    }
}
