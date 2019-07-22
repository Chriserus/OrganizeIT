package com.capgemini.organizeIT.services;

import com.capgemini.organizeIT.entities.User;
import com.capgemini.organizeIT.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> list(){
        return userRepository.findAll();
    }
}
