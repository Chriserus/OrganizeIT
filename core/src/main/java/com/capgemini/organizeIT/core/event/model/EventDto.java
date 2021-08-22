package com.capgemini.organizeIT.core.event.model;

import com.capgemini.organizeIT.infrastructure.banner.entities.Banner;
import com.capgemini.organizeIT.infrastructure.comment.entities.Comment;
import com.capgemini.organizeIT.infrastructure.project.entities.Project;
import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
public class EventDto {
    private Long id;
    private String title;
    private Banner banner;
    private Set<Project> projects;
    private Set<Comment> comments;
    private Date created;
    private Date modified;
}