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

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vital-signs")
@RequiredArgsConstructor
public class VitalSignController {

    @PostMapping
    public ResponseEntity<ApiResponse<VitalSignResponse>> createVitalSign(
            @RequestBody CreateVitalSignRequest request) {
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
            .body(ApiResponse.<VitalSignResponse>builder()
                .success(true)
                .message("Vital sign recorded successfully")
                .data(toResponse(vitalSign))
                .build());
    }

    private VitalSignResponse toResponse(VitalSign vitalSign) {
        VitalSignResponse response = new VitalSignResponse();
        response.setId(vitalSign.getId());
        response.setHeight(vitalSign.getHeight());
        response.setWeight(vitalSign.getWeight());
        response.setTemperature(vitalSign.getTemperature());
        response.setSystolicBP(vitalSign.getSystolicBP());
        response.setDiastolicBP(vitalSign.getDiastolicBP());
        response.setHeartRate(vitalSign.getHeartRate());
        response.setRespiratoryRate(vitalSign.getRespiratoryRate());
        response.setSpo2(vitalSign.getSpo2());
        return response;
    }
}
