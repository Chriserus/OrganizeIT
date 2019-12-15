package com.capgemini.organizeIT.user.entities;

import com.capgemini.organizeIT.project.entities.Membership;
import com.capgemini.organizeIT.role.entities.Role;
import com.capgemini.organizeIT.shirt.entities.ShirtSize;
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
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    @Enumerated(EnumType.STRING)
    private ShirtType shirtType;
    @ManyToOne
    @JoinColumn(name = "shirtSize")
    private ShirtSize shirtSize;
    // TODO: Cannot annotate @JsonIgnore, because it makes password null when registering new user
    private String password;
    @CreationTimestamp
    private Date created;
    @UpdateTimestamp
    private Date modified;
    @ManyToMany(fetch = FetchType.EAGER)
    // TODO: Eager is required, else: LazyInitializationException, bcs session is not active. Inverse control?
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JoinTable(name = "user_role",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "role_id")})
    private Set<Role> roles;
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Membership> memberships;

}
