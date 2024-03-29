package com.capgemini.organizeIT.infrastructure.comment.entities;

import com.capgemini.organizeIT.infrastructure.event.entities.Event;
import com.capgemini.organizeIT.infrastructure.user.entities.User;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    private Boolean announcement = false;
    @ManyToOne
    @JoinColumn(name = "author")
    private User author;
    @ManyToOne
    @JoinColumn
    private Event event;
    private Boolean archived = false;
    @CreationTimestamp
    private Date created;
    @UpdateTimestamp
    private Date modified;
}
