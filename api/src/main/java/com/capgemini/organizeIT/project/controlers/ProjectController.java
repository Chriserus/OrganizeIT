package com.capgemini.organizeIT.project.controlers;

import com.capgemini.organizeIT.project.entities.Project;
import com.capgemini.organizeIT.project.services.ProjectService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(final ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/api/projects")
    public List<Project> allProjects() {
        return projectService.findAll();
    }

}
