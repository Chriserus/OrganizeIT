package com.capgemini.organizeIT.infrastructure.user.entities;

import com.capgemini.organizeIT.infrastructure.project.entities.Ownership;
import com.capgemini.organizeIT.infrastructure.role.entities.Role;
import com.capgemini.organizeIT.infrastructure.project.entities.Membership;
import com.capgemini.organizeIT.infrastructure.shirt.entities.ShirtSize;
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
    @Column(unique = true)
    private String email;
    private Boolean polishSpeaker;
    private String foodPreferences;
    @Enumerated(EnumType.STRING)
    private ShirtType shirtType;
    @Enumerated(EnumType.STRING)
    private City city;
    @ManyToOne
    @JoinColumn(name = "shirt_size")
    private ShirtSize shirtSize;
    private String password;
    private boolean enabled = true;
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
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Ownership> ownerships;
}
