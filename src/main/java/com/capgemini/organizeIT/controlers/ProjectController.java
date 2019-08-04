package com.capgemini.organizeIT.controlers;

import com.capgemini.organizeIT.entities.Project;
import com.capgemini.organizeIT.services.ProjectService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(final ProjectService projectService) {
        this.projectService = projectService;
    }

    @CrossOrigin
    @GetMapping("/api/projects")
    public List<Project> allProjects() {
        return projectService.findAll();
    }

}
