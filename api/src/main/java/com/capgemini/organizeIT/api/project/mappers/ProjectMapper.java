package com.capgemini.organizeIT.api.project.mappers;

import com.capgemini.organizeIT.core.project.model.ProjectDto;
import com.capgemini.organizeIT.core.project.services.ProjectService;
import com.capgemini.organizeIT.infrastructure.project.entities.Project;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class ProjectMapper {
    private final ModelMapper modelMapper;
    private final ProjectService projectService;

    public Project convertToEntity(ProjectDto projectDto) {
        Project project = modelMapper.map(projectDto, Project.class);
        Optional.ofNullable(projectDto.getId()).flatMap(projectService::findById).map(Project::getId).ifPresent(project::setId);
        return project;
    }

    public ProjectDto convertToDto(Project project) {
        return modelMapper.map(project, ProjectDto.class);
    }
}
