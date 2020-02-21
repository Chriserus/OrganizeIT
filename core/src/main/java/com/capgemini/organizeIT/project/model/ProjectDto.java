package com.capgemini.organizeIT.project.model;

import lombok.Data;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
public class ProjectDto {
    private Long id;
    private String title;
    private String description;
    private String technologies;
    private Set<MembershipDto> members = new HashSet<>();
    private Set<OwnershipDto> owners = new HashSet<>();
    private Integer maxMembers = 1;
    private boolean verified = false;
    private boolean confirmed = false;
    private Date created;
    private Date modified;
}
