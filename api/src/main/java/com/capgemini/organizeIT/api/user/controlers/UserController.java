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
import com.capgemini.organizeIT.infrastructure.user.entities.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
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
        if (principal == null)
            return null;
        return userMapper.convertToDto(userService.findByEmail(principal.getName()));
    }

    @GetMapping("/api/users")
    public List<UserDto> allUsers() {
        return userService.findAll().stream().map(userMapper::convertToDto).collect(Collectors.toList());
    }

    @DeleteMapping("/api/users/{userId}")
    public void deleteUser(@PathVariable final Long userId) {
        userService.delete(userService.findById(userId));
    }

    @GetMapping("/api/users/emails/{email}/")
    public UserDto userByEmail(@PathVariable final String email) {
        if (userService.findByEmail(email) == null) {
            return null;
        }
        return userMapper.convertToDto(userService.findByEmail(email));
    }

    @GetMapping("/api/users/{userId}/projects")
    public List<ProjectDto> projectsThatContainUser(@PathVariable final Long userId) {
        return projectService.findAllThatContainUser(userService.findById(userId)).stream().map(projectMapper::convertToDto).collect(Collectors.toList());
    }

    @PostMapping("/api/register")
    public UserDto register(@RequestBody AuthDto authDto) {
        if (!authDto.getEmail().endsWith("@capgemini.com")) {
            return null;
        }
        User user = userMapper.convertToEntity(authDto);
        user.setRoles(Set.of(roleService.findByName(DEFAULT_ROLE)));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.save(user);
        return userMapper.convertToDto(user);
    }

    @PatchMapping("/api/users/{userId}")
    public UserDto giveUserAdminRights(@PathVariable Long userId, @RequestParam boolean giveAdmin) {
        User user = userService.findById(userId);
        if (giveAdmin) {
            user.getRoles().add(roleService.findByName(ADMIN_ROLE));
        } else {
            user.getRoles().remove(roleService.findByName(ADMIN_ROLE));
        }
        return userMapper.convertToDto(userService.save(user));
    }

    @PutMapping("/api/users/{userId}")
    public UserDto updateUser(@RequestBody UserDto userDto, @PathVariable Long userId) {
        User originalUser = userService.findById(userId);
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
    }

    private boolean validateData(@RequestBody UserDto userDto) {
        return userDto.getFirstName() == null || userDto.getFirstName().equals("")
                || userDto.getLastName() == null || userDto.getLastName().equals("");
    }
}
