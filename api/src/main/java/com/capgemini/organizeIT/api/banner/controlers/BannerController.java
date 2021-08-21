package com.capgemini.organizeIT.api.banner.controlers;

import com.capgemini.organizeIT.api.banner.mappers.BannerMapper;
import com.capgemini.organizeIT.core.banner.model.BannerDto;
import com.capgemini.organizeIT.core.banner.services.BannerService;
import com.capgemini.organizeIT.infrastructure.banner.entities.Banner;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Log4j2
@CrossOrigin
@RestController
@RequiredArgsConstructor
public class BannerController {
    private final BannerService bannerService;
    private final BannerMapper bannerMapper;

    @PostMapping("/api/banner")
    public ResponseEntity<BannerDto> addBanner(@RequestParam("file") MultipartFile file, @RequestParam("name") String name) {
        BannerDto bannerDto = new BannerDto();
        try {
            bannerDto.setName(name);
            bannerDto.setFile(file.getBytes());
        } catch (IOException e) {
            log.error(e);
        }
        Banner banner = bannerMapper.convertToEntity(bannerDto);
        bannerService.save(banner);
        return ResponseEntity.ok(bannerMapper.convertToDto(banner));
    }

    @GetMapping("/api/banner")
    public ResponseEntity<BannerDto> activeBanner() {
        return ResponseEntity.ok(bannerMapper.convertToDto(bannerService.findActiveBanner().orElse(null)));
    }

}