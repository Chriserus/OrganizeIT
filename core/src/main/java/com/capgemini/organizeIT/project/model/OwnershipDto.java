package com.capgemini.organizeIT.project.model;

import com.capgemini.organizeIT.user.model.UserDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.Date;

@Data
public class OwnershipDto {
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ProjectDto project;
    private UserDto user;
    private Date created;
    private Date modified;
}
