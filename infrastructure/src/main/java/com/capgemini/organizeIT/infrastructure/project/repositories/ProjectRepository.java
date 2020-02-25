package com.capgemini.organizeIT.infrastructure.project.repositories;

import com.capgemini.organizeIT.infrastructure.project.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
}
