package com.capgemini.organizeIT.core.comment.model;

import com.capgemini.organizeIT.core.user.model.UserDto;
import lombok.Data;

import java.util.Date;

@Data
public class CommentDto {
    private Long id;
    private String content;
    private boolean announcement;
    private UserDto author;
    private Date created;
    private Date modified;
}
