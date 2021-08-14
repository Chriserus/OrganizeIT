package com.capgemini.organizeIT.api.event.controlers;

import com.capgemini.organizeIT.core.event.services.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@CrossOrigin
@RestController
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @GetMapping(value = "/api/event", produces = "text/csv")
    public ResponseEntity<InputStreamResource> exportEvent() {
        String csvFileName = "event.csv";
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + csvFileName);
        headers.set(HttpHeaders.CONTENT_TYPE, "text/csv");
        return new ResponseEntity<>(eventService.exportCSV(), headers, HttpStatus.OK);
    }
}