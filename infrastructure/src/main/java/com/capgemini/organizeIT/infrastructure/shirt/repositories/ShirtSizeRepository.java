package com.capgemini.organizeIT.infrastructure.shirt.repositories;

import com.capgemini.organizeIT.infrastructure.shirt.entities.ShirtSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShirtSizeRepository extends JpaRepository<ShirtSize, Long> {
    ShirtSize findBySize(String size);
}

