package com.capgemini.organizeIT.user.controlers;

import com.capgemini.organizeIT.user.services.UserService;
import com.capgemini.organizeIT.user.entities.User;
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
