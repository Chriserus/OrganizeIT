package com.capgemini.organizeIT.user.controlers;

import com.capgemini.organizeIT.user.services.UserService;
import com.capgemini.organizeIT.user.entities.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(final UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/api/users")
    public List<User> allUsers() {
        return userService.findAll();
    }

    @GetMapping("/api/users/ids/{id}")
    public User user(@PathVariable final Long id) {
        return userService.findById(id);
    }

    @GetMapping("/api/users/usernames/{username}")
    public User userByEmail(@PathVariable final String username) {
        return userService.findByUsername(username);
    }

}
