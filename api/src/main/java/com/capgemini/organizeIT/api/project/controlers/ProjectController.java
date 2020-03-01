package com.capgemini.organizeIT.api.project.controlers;

import com.capgemini.organizeIT.infrastructure.project.entities.Membership;
import com.capgemini.organizeIT.infrastructure.project.entities.Ownership;
import com.capgemini.organizeIT.infrastructure.project.entities.Project;
import com.capgemini.organizeIT.api.project.mappers.ProjectMapper;
import com.capgemini.organizeIT.core.project.model.ProjectDto;
import com.capgemini.organizeIT.core.project.services.ProjectService;
import com.capgemini.organizeIT.infrastructure.user.entities.User;
import com.capgemini.organizeIT.core.user.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@CrossOrigin
@RestController
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final ProjectMapper projectMapper;
    private final UserService userService;

    @GetMapping("/api/projects")
    public List<ProjectDto> findAllProjects() {
        return projectService.findAllSortByDateNewFirst().stream().map(projectMapper::convertToDto).collect(Collectors.toList());
    }

    @PostMapping("/api/projects")
    public ProjectDto addProject(@RequestBody ProjectDto projectDto, @RequestParam(required = false) boolean joinProject, Principal principal) {
        log.info(projectDto);
        Project project = projectMapper.convertToEntity(projectDto);
        addCurrentLoggedInUserAsOwner(project, principal);
        if (joinProject) {
            addOwnerAsProjectMember(project, principal);
        }
        return projectMapper.convertToDto(projectService.save(project));
    }

    private void addCurrentLoggedInUserAsOwner(Project project, Principal principal) {
        User user = userService.findByEmail(principal.getName());
        Ownership ownership = new Ownership();
        ownership.setProject(project);
        ownership.setUser(user);
        project.getOwners().add(ownership);
        project.setCity(user.getCity());
        log.info("Owners after: {}", project.getOwners());
        userService.save(user);
    }

    private void addOwnerAsProjectMember(Project project, Principal principal) {
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
    public void verifyProject(@PathVariable Long id, @RequestParam boolean verifyProject) {
        projectService.findById(id).ifPresent(project -> {
            if (loggedInUserIsAdmin()) {
                project.setVerified(verifyProject);
                projectService.save(project);
            }
        });
    }

    @PatchMapping("/api/projects/{id}")
    public void confirmProject(@PathVariable Long id, @RequestParam boolean confirmProject) {
        projectService.findById(id).ifPresent(project -> {
            if (loggedInUserIsAdmin() && project.getVerified()) {
                project.setConfirmed(confirmProject);
                projectService.save(project);
            }
        });
    }

    @PutMapping("/api/projects")
    public void modifyProject(@RequestBody ProjectDto projectDto) {
        projectService.findById(projectDto.getId()).ifPresent(project -> {
            if (!project.getTitle().equals(projectDto.getTitle())) {
                log.info("Modifying title");
                project.setTitle(projectDto.getTitle());
            }
            if (!project.getDescription().equals(projectDto.getDescription())) {
                log.info("Modifying description");
                project.setDescription(projectDto.getDescription());
            }
            if (!project.getTechnologies().equals(projectDto.getTechnologies())) {
                log.info("Modifying technologies");
                project.setTechnologies(projectDto.getTechnologies());
            }
            if(projectDto.getMaxMembers() > 5){
                projectDto.setMaxMembers(5);
            }
            if (!project.getMaxMembers().equals(projectDto.getMaxMembers()) &&
                    projectDto.getMaxMembers() >= countApprovedMembers(project)) {
                log.info("Modifying maximum number of members");
                log.info("Old: " + countApprovedMembers(project) + "/" + project.getMaxMembers());
                log.info("New: " + countApprovedMembers(project) + "/" + projectDto.getMaxMembers());
                project.setMaxMembers(projectDto.getMaxMembers());
            }
            if (!project.getCity().equals(projectDto.getCity())) {
                log.info("Modifying city");
                project.setCity(projectDto.getCity());
            }
            projectService.save(project);
        });
    }

    private long countApprovedMembers(Project project) {
        return project.getMembers().stream().filter(Membership::getApproved).count();
    }

    //TODO: Check if it works
    private boolean loggedInUserIsAdmin() {
        return !SecurityContextHolder.getContext().getAuthentication().getAuthorities().contains(new SimpleGrantedAuthority("ADMIN"));
    }
}
