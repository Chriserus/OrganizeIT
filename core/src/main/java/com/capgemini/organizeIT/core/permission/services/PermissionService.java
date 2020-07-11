package com.capgemini.organizeIT.core.permission.services;

import com.capgemini.organizeIT.infrastructure.permission.entities.Permission;
import com.capgemini.organizeIT.infrastructure.permission.repositories.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PermissionService {
    private final PermissionRepository permissionRepository;

    public Permission save(Permission permission) {
        return permissionRepository.save(permission);
    }

    public Set<Permission> findByEmail(String email) {
        return permissionRepository.findByHolder_Email(email);
    }

    public Optional<Permission> findById(Long id) {
        return permissionRepository.findById(id);
    }
}
