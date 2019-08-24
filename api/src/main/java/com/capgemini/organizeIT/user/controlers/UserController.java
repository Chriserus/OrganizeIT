package com.capgemini.organizeIT.user.controlers;

import com.capgemini.organizeIT.user.entities.User;
import com.capgemini.organizeIT.user.services.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin
@Log4j2
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

    @GetMapping("/api/users/emails/{email}/")
    public User userByEmail(@PathVariable final String email) {
        log.info(email);
        return userService.findByEmail(email);
    }

    @GetMapping("/api/email")
    public String currentUserName(Principal principal) {
        return principal.getName();
    }

    @GetMapping("/api/user")
    public User currentUser(Principal principal) {
        return userService.findByEmail(principal.getName());
    }

    @PostMapping("/api/register")
    public User register(@RequestBody User newUser) {
        if (userService.emailAlreadyExists(newUser)) {
            return null;
        }
        return userService.save(newUser);
    }

}
