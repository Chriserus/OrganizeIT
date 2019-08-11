package com.capgemini.organizeIT.role.repositories;

import com.capgemini.organizeIT.role.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
}
