package com.capgemini.organizeIT.project.controlers;

import com.capgemini.organizeIT.project.entities.Project;
import com.capgemini.organizeIT.project.services.ProjectService;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Log4j2
@CrossOrigin
@RestController
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(final ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/api/projects")
    public List<Project> findAllProjects() {
        return projectService.findAllSortByDateNewFirst();
    }

    @PostMapping("/api/projects")
    public Project addProject(@RequestBody Project project) {
        log.info(project);
        return projectService.save(project);
    }

    @DeleteMapping("/api/projects/{id}")
    public void deleteProject(@PathVariable Long id, Principal principal) {
        projectService.findById(id).ifPresent(project -> {
            if (principal.getName().equals(project.getOwner().getEmail()) || loggedInUserIsAdmin()) {
                log.info("Deleting project: {}", project);
                projectService.deleteById(id);
            }
        });
    }

    @PutMapping("/api/projects/{id}")
    public void verifyProject(@PathVariable Long id) {
        projectService.findById(id).ifPresent(project -> {
            if (loggedInUserIsAdmin()) {
                log.info("Verifying project: {}", project);
                project.setVerified(true);
                projectService.save(project);
            }
        });
    }

    //TODO: Check if it works
    private boolean loggedInUserIsAdmin() {
        return !SecurityContextHolder.getContext().getAuthentication().getAuthorities().contains(new SimpleGrantedAuthority("ADMIN"));
    }
}
