package com.capgemini.organizeIT.infrastructure.banner.repositories;

import com.capgemini.organizeIT.infrastructure.banner.entities.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    Optional<Banner> findByActiveTrue();
}
