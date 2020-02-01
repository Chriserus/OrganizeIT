package com.capgemini.organizeIT.permission.services;

import com.capgemini.organizeIT.permission.entities.Permission;
import com.capgemini.organizeIT.permission.repositories.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PermissionService {
    private final PermissionRepository permissionRepository;

    public List<Permission> findAll() {
        return permissionRepository.findAll();
    }

    public Permission save(Permission permission) {
        return permissionRepository.save(permission);
    }

    public Set<Permission> findByEmail(String email) {
        return permissionRepository.findByHolder_Email(email);
    }
}
