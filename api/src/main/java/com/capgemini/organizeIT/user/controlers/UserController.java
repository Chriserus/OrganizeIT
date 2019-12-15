package com.capgemini.organizeIT.user.controlers;

import com.capgemini.organizeIT.project.entities.Project;
import com.capgemini.organizeIT.project.services.ProjectService;
import com.capgemini.organizeIT.role.services.RoleService;
import com.capgemini.organizeIT.shirt.services.ShirtSizeService;
import com.capgemini.organizeIT.user.entities.ShirtType;
import com.capgemini.organizeIT.user.entities.User;
import com.capgemini.organizeIT.user.entities.UserDto;
import com.capgemini.organizeIT.user.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin
@Log4j2
@RequiredArgsConstructor
public class UserController {
    private static final String DEFAULT_ROLE = "ROLE_USER";
    private final UserService userService;
    private final RoleService roleService;
    private final ProjectService projectService;
    private final ShirtSizeService shirtSizeService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/api/user")
    public User currentUser(Principal principal) {
        if (principal == null)
            return null;
        return userService.findByEmail(principal.getName());
    }

    @GetMapping("/api/users")
    public List<User> allUsers() {
        return userService.findAll();
    }

    @GetMapping("/api/users/{userId}")
    public User user(@PathVariable final Long userId) {
        return userService.findById(userId);
    }

    @GetMapping("/api/users/emails/{email}/")
    public User userByEmail(@PathVariable final String email) {
        log.info(email);
        return userService.findByEmail(email);
    }
    
    @GetMapping("/api/users/{userId}/projects")
    public List<Project> projectsThatContainUser(@PathVariable final Long userId) {
        return projectService.findAllThatContainUser(userService.findById(userId));
    }

    @PostMapping("/api/register")
    public User register(@RequestBody User user) {
        user.setRoles(Set.of(roleService.findByName(DEFAULT_ROLE)));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        log.info(user);
        return userService.save(user);
    }

    // TODO: Verify, that user is allowed to do this (logged in user sent it)
    @PutMapping("/api/users/{userId}")
    public User updateUser(@RequestBody User modifiedUser, @PathVariable Long userId) {
        User originalUser = userService.findById(userId);
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
        return modifiedUser.getFirstName() == null || modifiedUser.getFirstName().equals("")
                || modifiedUser.getLastName() == null || modifiedUser.getLastName().equals("");
    }
}
