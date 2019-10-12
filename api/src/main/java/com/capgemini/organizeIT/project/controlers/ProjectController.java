package com.capgemini.organizeIT.project.controlers;

import com.capgemini.organizeIT.project.entities.Project;
import com.capgemini.organizeIT.project.services.ProjectService;
import com.capgemini.organizeIT.user.services.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Log4j2
@CrossOrigin
@RestController
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
    public List<Project> findAllProjectsByOwnerOrMember(@PathVariable final String ownerEmail) {
        return projectService.findAllThatContainUser(userService.findByEmail(ownerEmail));
    }

    @PostMapping("/api/project")
    public Project addProject(@RequestBody Project project) {
        log.info(project);
        return projectService.save(project);
    }

    @DeleteMapping("/api/project/{id}")
    public void deleteProject(@PathVariable Long id, Principal principal) {
        projectService.findById(id).ifPresent(project -> {
            if (principal.getName().equals(project.getOwner().getEmail())) {
                log.info("Deleting project: {}", project);
                projectService.deleteById(id);
            }
        });
    }
}
