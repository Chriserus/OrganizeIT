package com.capgemini.organizeIT.shirt.controlers;

import com.capgemini.organizeIT.shirt.entities.ShirtSize;
import com.capgemini.organizeIT.shirt.services.ShirtSizeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Log4j2
@CrossOrigin
@RestController
@RequiredArgsConstructor
public class ShirtSizeController {
    private final ShirtSizeService shirtSizeService;

    @GetMapping("/api/shirt-sizes")
    public List<ShirtSize> findAllProjects() {
        return shirtSizeService.findAll();
    }
}
