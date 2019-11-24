package com.capgemini.organizeIT.comment.entities;

import com.capgemini.organizeIT.user.entities.User;
import lombok.Builder;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Data
@Builder
@Entity
public class Comment { // Comment should be name of a domain class - here we should call it CommentEntity
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    // If value cannot be null it's better to use primitive boolean - it saves you a null checks ;)
    private Boolean announcement = false;
    @ManyToOne
    @JoinColumn(name = "author")
    private User author;
    @CreationTimestamp
    private Date created;
    @UpdateTimestamp
    private Date modified;
}
