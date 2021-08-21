package com.capgemini.organizeIT.api.banner.mappers;

import com.capgemini.organizeIT.core.banner.model.BannerDto;
import com.capgemini.organizeIT.core.banner.services.BannerService;
import com.capgemini.organizeIT.infrastructure.banner.entities.Banner;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class BannerMapper {
    private final ModelMapper modelMapper;
    private final BannerService bannerService;

    public Banner convertToEntity(BannerDto bannerDto) {
        Banner banner = modelMapper.map(bannerDto, Banner.class);
        Optional.ofNullable(bannerDto.getId()).flatMap(bannerService::findById).map(Banner::getId).ifPresent(banner::setId);
        return banner;
    }

    public BannerDto convertToDto(Banner banner) {
        return modelMapper.map(banner, BannerDto.class);
    }
}