package com.capgemini.organizeIT.user.model;

import com.capgemini.organizeIT.project.model.MembershipDto;
import com.capgemini.organizeIT.project.model.OwnershipDto;
import com.capgemini.organizeIT.role.model.RoleDto;
import com.capgemini.organizeIT.shirt.entities.ShirtSize;
import com.capgemini.organizeIT.shirt.model.ShirtSizeDto;
import com.capgemini.organizeIT.user.entities.City;
import com.capgemini.organizeIT.user.entities.ShirtType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.Date;
import java.util.Set;

@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Boolean polishSpeaker;
    private ShirtType shirtType;
    private City city;
    private ShirtSizeDto shirtSize;
    private Date created;
    private Date modified;
    private Set<RoleDto> roles;
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<MembershipDto> memberships;
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<OwnershipDto> ownerships;
}
