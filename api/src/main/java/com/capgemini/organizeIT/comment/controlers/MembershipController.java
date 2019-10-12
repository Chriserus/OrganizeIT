package com.capgemini.organizeIT.comment.controlers;

import com.capgemini.organizeIT.project.entities.Membership;
import com.capgemini.organizeIT.project.entities.Project;
import com.capgemini.organizeIT.project.services.ProjectService;
import com.capgemini.organizeIT.user.entities.User;
import com.capgemini.organizeIT.user.services.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Log4j2
@CrossOrigin
@RestController
public class MembershipController {
    private final ProjectService projectService;
    private final UserService userService;

    public MembershipController(final ProjectService projectService, final UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    @PostMapping("/api/project/membership/{projectId}/{memberEmail}/")
    public Project addPotentialMemberByEmail(@PathVariable Long projectId, @PathVariable String memberEmail) {
        return projectService.addPotentialMemberByEmail(projectId, memberEmail);
    }

    @PutMapping("/api/project/membership/{projectId}/{memberEmail}/")
    public Project acceptPotentialProjectMember(@PathVariable Long projectId, @PathVariable String memberEmail) {
        return projectService.findById(projectId).map(project -> {
            User user = userService.findByEmail(memberEmail);
            Optional<Membership> optionalMember = extractOptionalMemberByEmail(memberEmail, project);
            optionalMember.ifPresent(member -> {
                member.setApproved(true);
                project.getMembers().add(member);
            });
            userService.save(user);
            return projectService.save(project);
        }).orElse(null);
    }

    @DeleteMapping("/api/project/membership/{projectId}/{memberEmail}/")
    public Project removeProjectMember(@PathVariable Long projectId, @PathVariable String memberEmail) {
        return projectService.findById(projectId).map(project -> {
            User user = userService.findByEmail(memberEmail);
            Optional<Membership> optionalMember = extractOptionalMemberByEmail(memberEmail, project);
            optionalMember.ifPresent(member ->
                    log.info("Removing member: {} with result: {}", member.getUser().getEmail(), project.getMembers().remove(member)));
            userService.save(user);
            return projectService.save(project);
        }).orElse(null);
    }

    private Optional<Membership> extractOptionalMemberByEmail(@PathVariable String memberEmail, Project project) {
        return project.getMembers().stream()
                .filter(membership -> membership.getUser().equals(userService.findByEmail(memberEmail))).findFirst();
    }
}
