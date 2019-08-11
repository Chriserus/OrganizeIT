package com.capgemini.organizeIT.role.entities;

import com.capgemini.organizeIT.user.entities.User;
import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Data
@Entity
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @ManyToMany(mappedBy = "roles")
    private Set<User> users;
}
