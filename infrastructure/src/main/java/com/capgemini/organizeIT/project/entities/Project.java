package com.capgemini.organizeIT.project.entities;

import com.capgemini.organizeIT.user.entities.User;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @ManyToOne
    @JoinColumn(name = "owner")
    private User owner;
    // TODO: add: private User[] or set of members;
    private Integer maxMembers = 1;
    @CreationTimestamp
    private Date created;
    @UpdateTimestamp
    private Date modified;
}
