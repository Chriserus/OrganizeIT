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
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    @CreationTimestamp
    private Date created;
    @UpdateTimestamp
    private Date modified;
    
    @ManyToMany(fetch = FetchType.EAGER)
    // TODO: Eager is required, else: LazyInitializationException, bcs session is not active. Inverse control?
    @JsonIgnore
    @JoinTable(name = "user_role",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "role_id")})
    private Set<Role> roles;

    public User() {

    }
    //TODO: Is this constructor necessary?
    public User(String firstName, String lastName, String email, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}
