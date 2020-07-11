package com.capgemini.organizeIT.core.role.services;

import com.capgemini.organizeIT.infrastructure.role.entities.Role;
import com.capgemini.organizeIT.infrastructure.role.repositories.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(final RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public Role findByName(String name){
        return roleRepository.findByName(name);
    }
}
