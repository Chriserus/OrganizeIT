package com.capgemini.organizeIT.infrastructure.project.repositories;

import com.capgemini.organizeIT.infrastructure.project.entities.Project;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByArchivedFalse(Sort sort);
}
