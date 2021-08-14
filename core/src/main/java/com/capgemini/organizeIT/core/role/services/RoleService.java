package com.capgemini.organizeIT.core.role.services;

import com.capgemini.organizeIT.infrastructure.role.entities.Role;
import com.capgemini.organizeIT.infrastructure.role.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    public Optional<Role> findByName(String name) {
        return roleRepository.findByName(name);
    }
}
