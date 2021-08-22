package com.capgemini.organizeIT.api.shirt.controlers;

import com.capgemini.organizeIT.api.shirt.mappers.ShirtSizeMapper;
import com.capgemini.organizeIT.core.shirt.model.ShirtSizeDto;
import com.capgemini.organizeIT.core.shirt.services.ShirtSizeService;
import com.capgemini.organizeIT.infrastructure.shirt.entities.ShirtSize;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<List<ShirtSizeDto>> findAllShirtSizes() {
        return ResponseEntity.ok(shirtSizeService.findAll().stream().map(shirtSizeMapper::convertToDto).collect(Collectors.toList()));
    }

    @GetMapping("/api/shirt-sizes/active")
    public ResponseEntity<List<ShirtSizeDto>> findAllActiveShirtSizes() {
        return ResponseEntity.ok(shirtSizeService.findAllActive().stream().map(shirtSizeMapper::convertToDto).collect(Collectors.toList()));
    }

    @PatchMapping("/api/shirt-sizes")
    public ResponseEntity<List<ShirtSizeDto>> updateShirtSizes(@RequestBody List<ShirtSizeDto> shirtSizeDtos) {
        List<ShirtSize> shirtSizes = shirtSizeDtos.stream().map(shirtSizeMapper::convertToEntity).collect(Collectors.toList());
        return ResponseEntity.ok(shirtSizeService.saveAll(shirtSizes).stream().map(shirtSizeMapper::convertToDto).collect(Collectors.toList()));
    }
}
