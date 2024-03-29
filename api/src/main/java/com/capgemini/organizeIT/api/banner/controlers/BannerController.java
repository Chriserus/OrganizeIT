package com.capgemini.organizeIT.api.banner.controlers;

import com.capgemini.organizeIT.api.banner.mappers.BannerMapper;
import com.capgemini.organizeIT.core.banner.model.BannerDto;
import com.capgemini.organizeIT.core.banner.services.BannerService;
import com.capgemini.organizeIT.infrastructure.banner.entities.Banner;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping(value = "/api/banner/{id}", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getBanner(@PathVariable Long id) {
        Banner banner = bannerService.findById(id).orElse(new Banner());
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + banner.getName());
        return banner.getFile();
    }

    @PostMapping("/api/banner/{id}")
    public ResponseEntity<BannerDto> setNewActiveBanner(@PathVariable Long id) {
        bannerService.findAll().forEach(banner -> banner.setActive(false));
        Banner banner = bannerService.findById(id).orElse(new Banner());
        banner.setActive(true);
        bannerService.save(banner);
        return ResponseEntity.ok(bannerMapper.convertToDto(banner));
    }

    @DeleteMapping("/api/banner/{id}")
    public void deleteBanner(@PathVariable Long id) {
        bannerService.deleteById(id);
    }

    @GetMapping("/api/banner")
    public ResponseEntity<BannerDto> getActiveBanner() {
        return ResponseEntity.ok(bannerMapper.convertToDto(bannerService.findActiveBanner().orElse(null)));
    }

    @GetMapping("/api/banners")
    public ResponseEntity<List<BannerDto>> getAllBanners() {
        return ResponseEntity.ok(bannerService.findAll().stream().map(bannerMapper::convertToDto)
                .peek(bannerDto -> bannerDto.setFile(null)).collect(Collectors.toList()));
    }

}