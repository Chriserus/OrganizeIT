package com.capgemini.organizeIT.project.controlers;

import com.capgemini.organizeIT.project.entities.Project;
import com.capgemini.organizeIT.project.entities.ProjectUser;
import com.capgemini.organizeIT.project.services.ProjectService;
import com.capgemini.organizeIT.user.entities.User;
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
    public Project register(@RequestBody Project project) {
        log.info(project);
        projectService.save(project);
        return addMemberByEmail(project.getId(), project.getOwner().getEmail());
    }

    // TODO: Make it available only for project owner
    @DeleteMapping("/api/projects/{id}")
    public void deleteProject(@PathVariable Long id) {
        log.info("Deleting project: {}", projectService.findById(id).orElse(null));
        projectService.deleteById(id);
    }

    @PutMapping("/api/projects/{id}/{memberEmail}/")
    public Project addMemberByEmail(@PathVariable Long id, @PathVariable String memberEmail) {
        return projectService.findById(id).map(project -> {
            log.info("Members before: {}", project.getMembers());
            User user = userService.findByEmail(memberEmail);
            ProjectUser projectUser = new ProjectUser();
            projectUser.setProject(project);
            projectUser.setUser(user);
            if(user.getEmail().equals(project.getOwner().getEmail())){
                projectUser.setApproved(true);
            }
            project.getMembers().add(projectUser);
            log.info("Members after: {}", project.getMembers());
            userService.save(user);
            return projectService.save(project);
        }).orElse(null);

    }
}
