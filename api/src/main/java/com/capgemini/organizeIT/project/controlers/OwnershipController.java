package com.capgemini.organizeIT.project.controlers;

import com.capgemini.organizeIT.project.entities.Ownership;
import com.capgemini.organizeIT.project.entities.Project;
import com.capgemini.organizeIT.project.services.ProjectService;
import com.capgemini.organizeIT.user.entities.User;
import com.capgemini.organizeIT.user.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.stream.Collectors;

@Log4j2
@CrossOrigin
@RestController
@RequiredArgsConstructor
public class OwnershipController {
    private final ProjectService projectService;
    private final UserService userService;

    @PostMapping("/api/projects/{projectId}/ownerships/{ownerId}")
    public Project addOwnerByEmail(@PathVariable Long projectId, @PathVariable Long ownerId) {
        return projectService.findById(projectId).map(project -> {
            log.info("Owners before: {}", project.getOwners());
            User user = userService.findById(ownerId);
            Ownership ownership = new Ownership();
            ownership.setProject(project);
            ownership.setUser(user);
            project.getOwners().add(ownership);
            log.info("Owners after: {}", project.getOwners());
            userService.save(user);
            return projectService.save(project);
        }).orElse(null);
    }

    @GetMapping("/api/projects/{projectId}/ownerships")
    public Set<User> getProjectOwners(@PathVariable Long projectId) {
        return projectService.findById(projectId).map(project -> {
            return project.getOwners().stream().map(Ownership::getUser).collect(Collectors.toSet());
        }).orElse(null);
    }
}
