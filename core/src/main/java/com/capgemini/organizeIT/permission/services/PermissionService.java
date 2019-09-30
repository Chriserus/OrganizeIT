package com.capgemini.organizeIT.permission.services;

import com.capgemini.organizeIT.permission.entities.Permission;
import com.capgemini.organizeIT.permission.repositories.PermissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public PermissionService(final PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public List<Permission> findAll() {
        return permissionRepository.findAll();
    }

    public Permission save(Permission permission) {
        return permissionRepository.save(permission);
    }

    public Set<Permission> findByEmail(String email){
        return permissionRepository.findByHolder_Email(email);
    }
}
