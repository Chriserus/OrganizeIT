package com.capgemini.organizeIT.project.controlers;

import com.capgemini.organizeIT.project.entities.Project;
import com.capgemini.organizeIT.project.services.ProjectService;
import com.capgemini.organizeIT.user.services.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
@CrossOrigin
public class ProjectController {
    private final ProjectService projectService;
    private final UserService userService;

    public ProjectController(final ProjectService projectService, final UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    @GetMapping("/api/projects")
    public List<Project> findAllProjects() {
        return projectService.findAllSortByDateNewFirst();
    }

    @GetMapping("/api/projects/{ownerEmail}")
    public List<Project> findAllProjectsByOwner(@PathVariable final String ownerEmail) {
        return projectService.findAllByOwner(userService.findByEmail(ownerEmail));
    }

    @PostMapping(value = "/api/projects", consumes = "application/json", produces = "application/json")
    public Project register(@RequestBody Project newProject) {
        log.info(newProject);
        return projectService.save(newProject);
    }

}
