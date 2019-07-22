package com.capgemini.organizeIT.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class User {

    @Id
    @GeneratedValue
    private Long id;
    private String username;

    public String getUsername(){
        return username;
    }
}
