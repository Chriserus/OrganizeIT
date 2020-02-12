package com.capgemini.organizeIT.role.model;

import com.capgemini.organizeIT.user.model.UserDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.Set;

@Data
public class RoleDto {
    private Long id;
    private String name;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<UserDto> users;
}
