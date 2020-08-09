package com.capgemini.organizeIT.infrastructure.shirt.repositories;

import com.capgemini.organizeIT.infrastructure.shirt.entities.ShirtSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShirtSizeRepository extends JpaRepository<ShirtSize, Long> {
    List<ShirtSize> findAll();

    ShirtSize findBySize(String size);
}

