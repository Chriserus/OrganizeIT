package com.capgemini.organizeIT.entities;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @ManyToOne
    @JoinColumn(name="owner")
    private User owner;
    //private User[] members;
}
