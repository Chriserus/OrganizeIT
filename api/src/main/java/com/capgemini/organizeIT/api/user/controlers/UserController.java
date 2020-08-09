package com.capgemini.organizeIT.api.user.controlers;

import com.capgemini.organizeIT.api.project.mappers.ProjectMapper;
import com.capgemini.organizeIT.api.shirt.mappers.ShirtSizeMapper;
import com.capgemini.organizeIT.api.user.mappers.UserMapper;
import com.capgemini.organizeIT.core.project.model.ProjectDto;
import com.capgemini.organizeIT.core.project.services.ProjectService;
import com.capgemini.organizeIT.core.role.services.RoleService;
import com.capgemini.organizeIT.core.user.model.AuthDto;
import com.capgemini.organizeIT.core.user.model.UserDto;
import com.capgemini.organizeIT.core.user.services.UserService;
import com.capgemini.organizeIT.infrastructure.role.entities.Role;
import com.capgemini.organizeIT.infrastructure.user.entities.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@Log4j2
@RequiredArgsConstructor
public class UserController {
    private static final String DEFAULT_ROLE = "ROLE_USER";
    private static final String ADMIN_ROLE = "ROLE_ADMIN";
    private final UserService userService;
    private final RoleService roleService;
    private final ProjectService projectService;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final ProjectMapper projectMapper;
    private final ShirtSizeMapper shirtSizeMapper;

    @GetMapping("/api/user")
    public UserDto currentUser(Principal principal) {
        return Optional.ofNullable(principal).map(Principal::getName).flatMap(userService::findByEmail).map(userMapper::convertToDto).orElse(null);
    }

    @GetMapping("/api/users")
    public ResponseEntity<List<UserDto>> allUsers() {
        return ResponseEntity.ok(userService.findAll().stream().map(userMapper::convertToDto).collect(Collectors.toList()));
    }

    @DeleteMapping("/api/users/{userId}")
    public void deleteUser(@PathVariable final Long userId) {
        userService.findById(userId).ifPresent(userService::delete);
    }

    @GetMapping("/api/users/emails/{email}/")
    public UserDto userByEmail(@PathVariable final String email) {
        return userService.findByEmail(email).map(userMapper::convertToDto).orElse(null);
    }

    @GetMapping("/api/users/{userId}/projects")
    public List<ProjectDto> projectsThatContainUser(@PathVariable final Long userId) {
        return userService.findById(userId).map(user ->
                projectService.findAllThatContainUser(user).stream().map(projectMapper::convertToDto).collect(Collectors.toList())).orElse(null);
    }

    @PostMapping("/api/register")
    public UserDto register(@RequestBody AuthDto authDto) {
        if (!authDto.getEmail().endsWith("@capgemini.com")) {
            return null;
        }
        User user = userMapper.convertToEntity(authDto);
        user.setRoles(roleService.findByName(DEFAULT_ROLE).map(Set::of).orElse(Collections.emptySet()));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.save(user);
        return userMapper.convertToDto(user);
    }

    @PatchMapping("/api/users/{userId}")
    public UserDto giveUserAdminRights(@PathVariable Long userId, @RequestParam boolean giveAdmin) {
        return userService.findById(userId).map(user -> {
            Set<Role> userRoles = user.getRoles();
            if (giveAdmin) {
                roleService.findByName(ADMIN_ROLE).map(userRoles::add);
            } else {
                roleService.findByName(ADMIN_ROLE).map(userRoles::remove);
            }
            return userMapper.convertToDto(userService.save(user));
        }).orElse(null);
    }

    @PutMapping("/api/users/{userId}")
    public UserDto updateUser(@RequestBody UserDto userDto, @PathVariable Long userId) {
        return userService.findById(userId).map(originalUser -> {
            if (!SecurityContextHolder.getContext().getAuthentication().getName().equals(originalUser.getEmail())) {
                return null;
            }
            if (validateData(userDto)) {
                return userMapper.convertToDto(originalUser);
            }
            if (!originalUser.getFirstName().equals(userDto.getFirstName())) {
                originalUser.setFirstName(userDto.getFirstName());
            }
            if (!originalUser.getLastName().equals(userDto.getLastName())) {
                originalUser.setLastName(userDto.getLastName());
            }
            if (!originalUser.getShirtSize().equals(shirtSizeMapper.convertToEntity(userDto.getShirtSize()))) {
                originalUser.setShirtSize(shirtSizeMapper.convertToEntity(userDto.getShirtSize()));
            }
            if (!originalUser.getShirtType().equals(userDto.getShirtType())) {
                originalUser.setShirtType(userDto.getShirtType());
            }
            if (!originalUser.getCity().equals(userDto.getCity())) {
                originalUser.setCity(userDto.getCity());
            }
            if (!originalUser.getPolishSpeaker().equals(userDto.getPolishSpeaker())) {
                originalUser.setPolishSpeaker(userDto.getPolishSpeaker());
            }
            originalUser.setFoodPreferences(userDto.getFoodPreferences());
            return userMapper.convertToDto(userService.save(originalUser));
        }).orElse(null);
    }

    private boolean validateData(@RequestBody UserDto userDto) {
        return userDto.getFirstName() == null || userDto.getFirstName().equals("")
                || userDto.getLastName() == null || userDto.getLastName().equals("");
    }
}
