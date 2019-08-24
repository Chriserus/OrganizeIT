package com.capgemini.organizeIT.user.entities;

import com.capgemini.organizeIT.role.entities.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Data
@EqualsAndHashCode(exclude = "roles")
@ToString(exclude = "roles")
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    @ManyToMany(fetch = FetchType.EAGER)
    // TODO: Eager is required, else: LazyInitializationException, bcs session is not active. Inverse control?
    @JsonIgnore
    @JoinTable(name = "user_roles",
            joinColumns = {@JoinColumn(name = "users_id")},
            inverseJoinColumns = {@JoinColumn(name = "roles_id")})
    private Set<Role> roles;
    @CreationTimestamp
    private Date created;
    @UpdateTimestamp
    private Date modified;
    // TODO: Add name and surname fields -> get them from register form, identify users by email -> it is unique

    public User() {

    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
