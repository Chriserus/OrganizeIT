package com.capgemini.organizeIT.infrastructure.project.entities;

import com.capgemini.organizeIT.infrastructure.user.entities.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
public class Membership implements Serializable {
    @Id
    @ManyToOne
    @JoinColumn
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Project project;
    @Id
    @ManyToOne
    @JoinColumn
    private User user;
    private Boolean approved = false;
    @CreationTimestamp
    private Date created;
    @UpdateTimestamp
    private Date modified;
}
