package com.capgemini.organizeIT.project.entities;

import com.capgemini.organizeIT.user.entities.User;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

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
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Membership> members = new HashSet<>();
    private Integer maxMembers = 1;
    private Boolean verified = false;
    @CreationTimestamp
    private Date created;
    @UpdateTimestamp
    private Date modified;
}
