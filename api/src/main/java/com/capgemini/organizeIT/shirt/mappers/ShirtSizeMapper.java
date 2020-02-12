package com.capgemini.organizeIT.shirt.mappers;

import com.capgemini.organizeIT.shirt.entities.ShirtSize;
import com.capgemini.organizeIT.shirt.model.ShirtSizeDto;
import com.capgemini.organizeIT.shirt.services.ShirtSizeService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ShirtSizeMapper {
    private final ModelMapper modelMapper;
    private final ShirtSizeService shirtSizeService;

    public ShirtSize convertToEntity(ShirtSizeDto shirtSizeDto) {
        ShirtSize shirtSize = modelMapper.map(shirtSizeDto, ShirtSize.class);
        if (shirtSizeDto.getId() != null) {
            ShirtSize oldShirtSize = shirtSizeService.findById(shirtSizeDto.getId()).get();
            shirtSize.setId(oldShirtSize.getId());
        }
        return shirtSize;
    }

    public ShirtSizeDto convertToDto(ShirtSize shirtSize) {
        return modelMapper.map(shirtSize, ShirtSizeDto.class);
    }
}
