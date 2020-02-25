package com.capgemini.organizeIT.core.shirt.services;

import com.capgemini.organizeIT.infrastructure.shirt.entities.ShirtSize;
import com.capgemini.organizeIT.infrastructure.shirt.repositories.ShirtSizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public Optional<ShirtSize> findById(Long id) {
        return shirtSizeRepository.findById(id);
    }
}
