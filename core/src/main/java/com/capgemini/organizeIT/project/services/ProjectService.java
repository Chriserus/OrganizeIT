package com.capgemini.organizeIT.project.services;

import com.capgemini.organizeIT.project.entities.Project;
import com.capgemini.organizeIT.project.repositories.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(final ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> findAll() {
        return projectRepository.findAll();
    }
}
