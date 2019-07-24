package com.capgemini.organizeIT.controlers;

import com.capgemini.organizeIT.entities.User;
import com.capgemini.organizeIT.services.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(final UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> allUsers() {
        return userService.findAll();
    }

    @GetMapping("/users/{id}")
    public User user(@PathVariable final Long id) {
        return userService.findById(id);
    }
}
