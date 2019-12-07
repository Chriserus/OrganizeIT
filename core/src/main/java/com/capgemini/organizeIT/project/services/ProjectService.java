package com.capgemini.organizeIT.project.services;

import com.capgemini.organizeIT.project.entities.Membership;
import com.capgemini.organizeIT.project.entities.Project;
import com.capgemini.organizeIT.project.repositories.ProjectRepository;
import com.capgemini.organizeIT.user.entities.User;
import com.capgemini.organizeIT.user.services.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserService userService;

    public ProjectService(final ProjectRepository projectRepository, final UserService userService) {
        this.projectRepository = projectRepository;
        this.userService = userService;
    }

    public List<Project> findAllThatContainUser(User user) {
        return findAllSortByDateNewFirst().stream()
                .filter(project -> projectContainsMember(user, project) || userIsProjectOwner(user, project))
                .collect(Collectors.toList());
    }

    private boolean userIsProjectOwner(User user, Project project) {
        return project.getOwner().equals(user);
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

    public List<Project> findAllByOwner(User owner) {
        return projectRepository.findAllByOwner(owner);
    }

    public void deleteById(Long id) {
        projectRepository.deleteById(id);
    }

    public Optional<Project> findById(Long id) {
        return projectRepository.findById(id);
    }
}
