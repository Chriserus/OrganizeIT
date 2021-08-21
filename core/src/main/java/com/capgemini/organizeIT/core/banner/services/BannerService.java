package com.capgemini.organizeIT.core.banner.services;

import com.capgemini.organizeIT.infrastructure.banner.entities.Banner;
import com.capgemini.organizeIT.infrastructure.banner.repositories.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    public Optional<Banner> findById(Long id) {
        return bannerRepository.findById(id);
    }

    public Banner save(Banner banner) {
        return bannerRepository.save(banner);
    }

    public Optional<Banner> findActiveBanner() {
        return bannerRepository.findByActiveTrue();
    }

    public void deleteById(Long id) {
        bannerRepository.deleteById(id);
    }
}
