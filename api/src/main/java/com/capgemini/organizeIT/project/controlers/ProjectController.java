package com.capgemini.organizeIT.project.controlers;

import com.capgemini.organizeIT.project.entities.Project;
import com.capgemini.organizeIT.project.services.ProjectService;
import com.capgemini.organizeIT.user.services.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        // TODO: Do not add owner as member by default
        projectService.save(project);
        return projectService.addPotentialMemberByEmail(project.getId(), project.getOwner().getEmail());
    }

    // TODO: Make project management endpoints available only for project owner
    @DeleteMapping("/api/project/{id}")
    public void deleteProject(@PathVariable Long id) {
        log.info("Deleting project: {}", projectService.findById(id).orElse(null));
        projectService.deleteById(id);
    }
}
