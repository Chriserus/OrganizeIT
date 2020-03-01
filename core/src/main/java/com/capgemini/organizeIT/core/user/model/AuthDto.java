package com.capgemini.organizeIT.core.user.model;


import com.capgemini.organizeIT.core.shirt.model.ShirtSizeDto;
import com.capgemini.organizeIT.infrastructure.user.entities.City;
import com.capgemini.organizeIT.infrastructure.user.entities.ShirtType;
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
    private String foodPreferences;
    private Boolean enabled;
}
