package com.capgemini.organizeIT.project.entities;

import com.capgemini.organizeIT.user.entities.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;
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
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "project_user",
            joinColumns = {@JoinColumn(name = "project_id")},
            inverseJoinColumns = {@JoinColumn(name = "user_id")})
    private Set<User> members;
    private Integer maxMembers = 1;
    @CreationTimestamp
    private Date created;
    @UpdateTimestamp
    private Date modified;
}
