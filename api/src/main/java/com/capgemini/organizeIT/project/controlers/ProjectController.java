package com.capgemini.organizeIT.project.controlers;

import com.capgemini.organizeIT.project.entities.Membership;
import com.capgemini.organizeIT.project.entities.Ownership;
import com.capgemini.organizeIT.project.entities.Project;
import com.capgemini.organizeIT.project.services.ProjectService;
import com.capgemini.organizeIT.user.entities.User;
import com.capgemini.organizeIT.user.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Log4j2
@CrossOrigin
@RestController
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final UserService userService;

    @GetMapping("/api/projects")
    public List<Project> findAllProjects() {
        return projectService.findAllSortByDateNewFirst();
    }

    @PostMapping("/api/projects")
    public Project addProject(@RequestBody Project project, @RequestParam(required = false) boolean joinProject, Principal principal) {
        log.info(project);
        addCurrentLoggedInUserAsOwner(project, principal);
        if (joinProject) {
            addOwnerAsProjectMember(project, principal);
        }
        return projectService.save(project);
    }

    private void addCurrentLoggedInUserAsOwner(@RequestBody Project project, Principal principal) {
        User user = userService.findByEmail(principal.getName());
        Ownership ownership = new Ownership();
        ownership.setProject(project);
        ownership.setUser(user);
        project.getOwners().add(ownership);
        log.info("Owners after: {}", project.getOwners());
        userService.save(user);
    }

    private void addOwnerAsProjectMember(@RequestBody Project project, Principal principal) {
        User user = userService.findByEmail(principal.getName());
        Membership membership = new Membership();
        membership.setProject(project);
        membership.setUser(user);
        membership.setApproved(true);
        project.getMembers().add(membership);
        log.info("Members after: {}", project.getMembers());
        userService.save(user);
    }

    @DeleteMapping("/api/projects/{id}")
    public void deleteProject(@PathVariable Long id, Principal principal) {
        projectService.findById(id).ifPresent(project -> {
            if (projectService.userIsProjectOwner(project, userService.findByEmail(principal.getName())) || loggedInUserIsAdmin()) {
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

    @PutMapping("/api/projects")
    public void modifyProject(@RequestBody Project modifiedProject) {
        projectService.findById(modifiedProject.getId()).ifPresent(project -> {
            if (!project.getTitle().equals(modifiedProject.getTitle())) {
                log.info("Modifying title");
                project.setTitle(modifiedProject.getTitle());
            }
            if (!project.getDescription().equals(modifiedProject.getDescription())) {
                log.info("Modifying description");
                project.setDescription(modifiedProject.getDescription());
            }
            if (!project.getTechnologies().equals(modifiedProject.getTechnologies())) {
                log.info("Modifying technologies");
                project.setTechnologies(modifiedProject.getTechnologies());
            }
            projectService.save(project);
        });
    }

    //TODO: Check if it works
    private boolean loggedInUserIsAdmin() {
        return !SecurityContextHolder.getContext().getAuthentication().getAuthorities().contains(new SimpleGrantedAuthority("ADMIN"));
    }
}
