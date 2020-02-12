package com.capgemini.organizeIT.shirt.controlers;

import com.capgemini.organizeIT.shirt.mappers.ShirtSizeMapper;
import com.capgemini.organizeIT.shirt.model.ShirtSizeDto;
import com.capgemini.organizeIT.shirt.services.ShirtSizeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@CrossOrigin
@RestController
@RequiredArgsConstructor
public class ShirtSizeController {
    private final ShirtSizeService shirtSizeService;
    private final ShirtSizeMapper shirtSizeMapper;

    @GetMapping("/api/shirt-sizes")
    public List<ShirtSizeDto> findAllProjects() {
        return shirtSizeService.findAll().stream().map(shirtSizeMapper::convertToDto).collect(Collectors.toList());
    }
}
