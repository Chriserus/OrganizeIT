package com.capgemini.organizeIT.role.services;

import com.capgemini.organizeIT.role.entities.Role;
import com.capgemini.organizeIT.role.repositories.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(final RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    public Role findByName(String name){
        return roleRepository.findByName(name);
    }
}
