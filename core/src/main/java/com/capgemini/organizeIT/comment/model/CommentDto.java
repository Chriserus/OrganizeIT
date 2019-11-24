package com.capgemini.organizeIT.comment.model;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class CommentDto { // I call id with dto suffix but we should call it Comment

    private Long id;
    private String content;
    private Boolean announcement;
    private Long authorId; // Here we need correct UserDto not only its id
    private Date created;
    private Date modified;

}
