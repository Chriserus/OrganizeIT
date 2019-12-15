package com.capgemini.organizeIT.shirt.services;

import com.capgemini.organizeIT.shirt.entities.ShirtSize;
import com.capgemini.organizeIT.shirt.repositories.ShirtSizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShirtSizeService {
    private final ShirtSizeRepository shirtSizeRepository;

    public List<ShirtSize> findAll() {
        return shirtSizeRepository.findAll();
    }

    public ShirtSize findBySize(String size) {
        return shirtSizeRepository.findBySize(size);
    }
}
