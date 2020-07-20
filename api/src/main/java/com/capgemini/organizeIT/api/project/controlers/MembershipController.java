package com.capgemini.organizeIT.api.project.controlers;

import com.capgemini.organizeIT.api.project.mappers.ProjectMapper;
import com.capgemini.organizeIT.core.project.model.ProjectDto;
import com.capgemini.organizeIT.core.project.services.ProjectService;
import com.capgemini.organizeIT.core.user.services.UserService;
import com.capgemini.organizeIT.infrastructure.project.entities.Membership;
import com.capgemini.organizeIT.infrastructure.project.entities.Project;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@Log4j2
@CrossOrigin
@RestController
@RequiredArgsConstructor
public class MembershipController {
    private final ProjectService projectService;
    private final UserService userService;
    private final ProjectMapper projectMapper;

    @PostMapping("/api/projects/{projectId}/memberships/{memberId}")
    public ProjectDto addPotentialMemberByEmail(@PathVariable Long projectId, @PathVariable Long memberId) {
        return projectService.findById(projectId).flatMap(project -> userService.findById(memberId).map(user -> {
            log.info("Members before: {}", project.getMembers());
            Membership membership = new Membership();
            membership.setProject(project);
            membership.setUser(user);
            if (projectService.userIsProjectOwner(project, user)) {
                membership.setApproved(true);
            }
            project.getMembers().add(membership);
            log.info("Members after: {}", project.getMembers());
            userService.save(user);
            return projectMapper.convertToDto(projectService.save(project));
        })).orElse(null);
    }

    @PutMapping("/api/projects/{projectId}/memberships/{memberId}")
    public ProjectDto acceptPotentialProjectMember(@PathVariable Long projectId, @PathVariable Long memberId) {
        return projectService.findById(projectId).map(project -> {
            if (projectService.loggedInUserNotProjectOwner(project) && userService.loggedInUserIsNotAdmin()) {
                return projectMapper.convertToDto(project);
            }
            if (memberWouldExceedMaxCapacity(project)) {
                return null;
            }
            userService.findById(memberId).ifPresent(user ->
                    extractOptionalMemberById(memberId, project).ifPresent(member -> {
                        member.setApproved(true);
                        project.getMembers().add(member);
                        userService.save(user);
                    }));
            return projectMapper.convertToDto(projectService.save(project));
        }).orElse(null);
    }

    private boolean memberWouldExceedMaxCapacity(Project project) {
        log.info("Would be: {}/{}",
                project.getMembers().stream().filter(Membership::getApproved).count() + 1, project.getMaxMembers());
        return project.getMembers().stream().filter(Membership::getApproved).count() + 1 > project.getMaxMembers();
    }

    @DeleteMapping("/api/projects/{projectId}/memberships/{memberId}")
    public ProjectDto removeProjectMember(@PathVariable Long projectId, @PathVariable Long memberId) {
        return projectService.findById(projectId).map(project -> {
            if (projectService.loggedInUserNotProjectMembershipOwner(memberId) && projectService.loggedInUserNotProjectOwner(project) && userService.loggedInUserIsNotAdmin()) {
                return projectMapper.convertToDto(project);
            }
            userService.findById(memberId).ifPresent(user ->
                    extractOptionalMemberById(memberId, project).ifPresent(member -> {
                        log.info("Removing member: {} with result: {}", member.getUser().getEmail(), project.getMembers().remove(member));
                        userService.save(user);
                    }));
            return projectMapper.convertToDto(projectService.save(project));
        }).orElse(null);
    }

    private Optional<Membership> extractOptionalMemberById(Long memberId, Project project) {
        return userService.findById(memberId).flatMap(user -> project.getMembers().stream()
                .filter(membership -> membership.getUser().equals(user)).findFirst());
    }
}
