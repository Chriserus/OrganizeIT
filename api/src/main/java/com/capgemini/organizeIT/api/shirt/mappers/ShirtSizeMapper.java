package com.capgemini.organizeIT.api.shirt.mappers;

import com.capgemini.organizeIT.core.shirt.model.ShirtSizeDto;
import com.capgemini.organizeIT.core.shirt.services.ShirtSizeService;
import com.capgemini.organizeIT.infrastructure.shirt.entities.ShirtSize;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class ShirtSizeMapper {
    private final ModelMapper modelMapper;
    private final ShirtSizeService shirtSizeService;

    public ShirtSize convertToEntity(ShirtSizeDto shirtSizeDto) {
        ShirtSize shirtSize = modelMapper.map(shirtSizeDto, ShirtSize.class);
        Optional.ofNullable(shirtSizeDto.getId()).flatMap(shirtSizeService::findById).map(ShirtSize::getId).ifPresent(shirtSize::setId);
        return shirtSize;
    }

    public ShirtSizeDto convertToDto(ShirtSize shirtSize) {
        return modelMapper.map(shirtSize, ShirtSizeDto.class);
    }
}
