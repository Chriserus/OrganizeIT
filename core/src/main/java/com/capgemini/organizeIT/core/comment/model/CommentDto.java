package com.capgemini.organizeIT.core.comment.model;

import com.capgemini.organizeIT.core.user.model.UserDto;
import lombok.Data;

import java.util.Date;

@Data
public class CommentDto {
    private Long id;
    private String content;
    private boolean announcement;
    private UserDto author; // Here we need correct UserDto not only its id
    private Date created;
    private Date modified;
}
