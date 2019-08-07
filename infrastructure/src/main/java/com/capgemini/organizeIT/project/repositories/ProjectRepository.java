package com.capgemini.organizeIT.project.repositories;

import com.capgemini.organizeIT.project.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
}
