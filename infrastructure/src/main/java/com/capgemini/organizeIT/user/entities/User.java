package com.capgemini.organizeIT.user.entities;

import com.capgemini.organizeIT.role.entities.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Data
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    @Transient
    private String passwordConfirm;
    @ManyToMany
    @JsonIgnore
    @JoinTable(name="user_roles",
            joinColumns={@JoinColumn(name="fk_user")},
            inverseJoinColumns={@JoinColumn(name="fk_role")})
    private Set<Role> roles;

    public User(){

    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
