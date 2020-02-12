package com.capgemini.organizeIT.permission.model;

import com.capgemini.organizeIT.user.model.UserDto;
import lombok.Data;

import java.util.Date;

@Data
public class PermissionDto {
    private Long id;
    private String token;
    private UserDto holder;
    private Date created;
    private Date modified;
}

