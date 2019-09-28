package com.capgemini.organizeIT.project.services;

import com.capgemini.organizeIT.project.entities.Project;
import com.capgemini.organizeIT.project.repositories.ProjectRepository;
import com.capgemini.organizeIT.user.entities.User;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(final ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> findAll() {
        return projectRepository.findAll();
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

    public Optional<Project> findById(Long id){
        return projectRepository.findById(id);
    }
}
