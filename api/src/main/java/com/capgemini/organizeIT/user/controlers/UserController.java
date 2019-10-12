package com.capgemini.organizeIT.user.controlers;

import com.capgemini.organizeIT.role.services.RoleService;
import com.capgemini.organizeIT.user.entities.User;
import com.capgemini.organizeIT.user.services.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin
@Log4j2
public class UserController {
    private static final String DEFAULT_ROLE = "ROLE_USER";
    private final UserService userService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    public UserController(final UserService userService, final RoleService roleService, final PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
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
        if (principal == null)
            return null;
        return principal.getName();
    }

    @GetMapping("/api/user")
    public User currentUser(Principal principal) {
        if (principal == null)
            return null;
        return userService.findByEmail(principal.getName());
    }

    @PostMapping("/api/register")
    public User register(@RequestBody User newUser) {
        newUser.setRoles(Set.of(roleService.findByName(DEFAULT_ROLE)));
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        log.info(newUser);
        return userService.save(newUser);
    }

    // TODO: Verify, that user is allowed to do this (logged in user sent it)
    @PutMapping("/api/user/update/{userEmail}/")
    public User updateUser(@RequestBody User modifiedUser, @PathVariable String userEmail) {
        User originalUser = userService.findByEmail(userEmail);
        if (validateData(modifiedUser)) {
            return originalUser;
        }
        if (!originalUser.getFirstName().equals(modifiedUser.getFirstName())) {
            originalUser.setFirstName(modifiedUser.getFirstName());
        }
        if (!originalUser.getLastName().equals(modifiedUser.getLastName())) {
            originalUser.setLastName(modifiedUser.getLastName());
        }
        log.info(originalUser);
        return userService.save(originalUser);
    }

    private boolean validateData(@RequestBody User modifiedUser) {
        return modifiedUser.getFirstName() == null || modifiedUser.getFirstName().equals("") || modifiedUser.getLastName() == null || modifiedUser.getLastName().equals("");
    }
}
