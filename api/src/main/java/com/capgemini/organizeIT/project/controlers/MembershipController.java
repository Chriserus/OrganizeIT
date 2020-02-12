package com.capgemini.organizeIT.project.controlers;

import com.capgemini.organizeIT.project.entities.Membership;
import com.capgemini.organizeIT.project.entities.Project;
import com.capgemini.organizeIT.project.mappers.ProjectMapper;
import com.capgemini.organizeIT.project.model.ProjectDto;
import com.capgemini.organizeIT.project.services.ProjectService;
import com.capgemini.organizeIT.user.entities.User;
import com.capgemini.organizeIT.user.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
        return projectService.findById(projectId).map(project -> {
            log.info("Members before: {}", project.getMembers());
            User user = userService.findById(memberId);
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
        }).orElse(null);
    }

    @PutMapping("/api/projects/{projectId}/memberships/{memberId}")
    public ProjectDto acceptPotentialProjectMember(@PathVariable Long projectId, @PathVariable Long memberId) {
        return projectService.findById(projectId).map(project -> {
            if (loggedInUserNotProjectOwner(project) && !loggedInUserIsAdmin()) {
                return projectMapper.convertToDto(project);
            }
            User user = userService.findById(memberId);
            Optional<Membership> optionalMember = extractOptionalMemberById(memberId, project);
            optionalMember.ifPresent(member -> {
                member.setApproved(true);
                project.getMembers().add(member);
            });
            userService.save(user);
            return projectMapper.convertToDto(projectService.save(project));
        }).orElse(null);
    }

    @DeleteMapping("/api/projects/{projectId}/memberships/{memberId}")
    public ProjectDto removeProjectMember(@PathVariable Long projectId, @PathVariable Long memberId) {
        return projectService.findById(projectId).map(project -> {
            if (loggedInUserNotProjectOwner(project) && !loggedInUserIsAdmin()) {
                return projectMapper.convertToDto(project);
            }
            User user = userService.findById(memberId);
            Optional<Membership> optionalMember = extractOptionalMemberById(memberId, project);
            optionalMember.ifPresent(member ->
                    log.info("Removing member: {} with result: {}", member.getUser().getEmail(), project.getMembers().remove(member)));
            userService.save(user);
            return projectMapper.convertToDto(projectService.save(project));
        }).orElse(null);
    }

    private boolean loggedInUserNotProjectOwner(Project project) {
        return !projectService.userIsProjectOwner(project, userService.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()));
    }

    private boolean loggedInUserIsAdmin() {
        return !SecurityContextHolder.getContext().getAuthentication().getAuthorities().contains(new SimpleGrantedAuthority("ADMIN"));
    }

    private Optional<Membership> extractOptionalMemberById(Long memberId, Project project) {
        return project.getMembers().stream()
                .filter(membership -> membership.getUser().equals(userService.findById(memberId))).findFirst();
    }
}
