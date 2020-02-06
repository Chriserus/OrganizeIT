package com.capgemini.organizeIT.project.repositories;

import com.capgemini.organizeIT.project.entities.Project;
import com.capgemini.organizeIT.user.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
}
