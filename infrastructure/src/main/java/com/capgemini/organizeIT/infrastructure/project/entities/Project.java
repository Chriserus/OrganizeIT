package com.capgemini.organizeIT.infrastructure.project.entities;

import com.capgemini.organizeIT.infrastructure.user.entities.City;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
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
    private String technologies;
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Membership> members = new HashSet<>();
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Ownership> owners = new HashSet<>();
    private Integer maxMembers = 1;
    private Boolean verified = false;
    private Boolean confirmed = false;
    @Enumerated(EnumType.STRING)
    private City city;
    @CreationTimestamp
    private Date created;
    @UpdateTimestamp
    private Date modified;
}
