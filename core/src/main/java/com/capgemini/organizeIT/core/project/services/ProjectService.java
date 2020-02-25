package com.capgemini.organizeIT.core.project.services;

import com.capgemini.organizeIT.core.user.services.UserService;
import com.capgemini.organizeIT.infrastructure.project.entities.Membership;
import com.capgemini.organizeIT.infrastructure.project.entities.Ownership;
import com.capgemini.organizeIT.infrastructure.project.entities.Project;
import com.capgemini.organizeIT.infrastructure.project.repositories.ProjectRepository;
import com.capgemini.organizeIT.infrastructure.user.entities.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserService userService;

    public List<Project> findAllThatContainUser(User user) {
        return findAllSortByDateNewFirst().stream()
                .filter(project -> projectContainsMember(user, project) || userIsProjectOwner(project, user))
                .collect(Collectors.toList());
    }

    public boolean userIsProjectOwner(Project project, User user) {
        return project.getOwners().stream().map(Ownership::getUser).anyMatch(owner -> user.getEmail().equals(owner.getEmail()));
    }

    private boolean projectContainsMember(User user, Project project) {
        return project.getMembers().stream().map(Membership::getUser).anyMatch(member -> member.equals(user));
    }

    public List<Project> findAllSortByDateNewFirst() {
        return projectRepository.findAll(Sort.by(Sort.Direction.DESC, "created"));
    }

    public Project save(Project project) {
        return projectRepository.save(project);
    }

    public void deleteById(Long id) {
        projectRepository.deleteById(id);
    }

    public Optional<Project> findById(Long id) {
        return projectRepository.findById(id);
    }
}
