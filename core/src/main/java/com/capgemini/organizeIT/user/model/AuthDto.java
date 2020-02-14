package com.capgemini.organizeIT.user.model;


import com.capgemini.organizeIT.shirt.model.ShirtSizeDto;
import com.capgemini.organizeIT.user.entities.City;
import com.capgemini.organizeIT.user.entities.ShirtType;
import lombok.Data;

@Data
public class AuthDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Boolean polishSpeaker;
    private ShirtType shirtType;
    private City city;
    private ShirtSizeDto shirtSize;
    private String password;
}
