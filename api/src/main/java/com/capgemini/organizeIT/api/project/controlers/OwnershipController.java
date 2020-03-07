package com.capgemini.organizeIT.api.project.controlers;

import com.capgemini.organizeIT.infrastructure.project.entities.Ownership;
import com.capgemini.organizeIT.api.project.mappers.ProjectMapper;
import com.capgemini.organizeIT.core.project.model.ProjectDto;
import com.capgemini.organizeIT.core.project.services.ProjectService;
import com.capgemini.organizeIT.infrastructure.user.entities.User;
import com.capgemini.organizeIT.api.user.mappers.UserMapper;
import com.capgemini.organizeIT.core.user.model.UserDto;
import com.capgemini.organizeIT.core.user.services.UserService;
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
    private final ProjectMapper projectMapper;
    private final UserMapper userMapper;

    @PostMapping("/api/projects/{projectId}/ownerships/{ownerId}")
    public ProjectDto giveOwnershipToUserById(@PathVariable Long projectId, @PathVariable Long ownerId) {
        return projectService.findById(projectId).map(project -> {
            log.info("Owners before: {}", project.getOwners());
            User user = userService.findById(ownerId);
            if(project.getOwners().stream().map(Ownership::getUser).collect(Collectors.toSet()).contains(user) && projectService.loggedInUserNotProjectOwner(project)){
                return projectMapper.convertToDto(project);
            }
            Ownership ownership = new Ownership();
            ownership.setProject(project);
            ownership.setUser(user);
            project.getOwners().add(ownership);
            log.info("Owners after: {}", project.getOwners());
            userService.save(user);
            return projectMapper.convertToDto(projectService.save(project));
        }).orElse(null);
    }

    @GetMapping("/api/projects/{projectId}/ownerships")
    public Set<UserDto> getProjectOwners(@PathVariable Long projectId) {
        return projectService.findById(projectId).map(project -> project.getOwners().stream().map(Ownership::getUser).map(userMapper::convertToDto).collect(Collectors.toSet())).orElse(null);
    }
}
