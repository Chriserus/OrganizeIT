package com.capgemini.organizeIT.permission.controlers;

import com.capgemini.organizeIT.comment.entities.Comment;
import com.capgemini.organizeIT.comment.services.CommentService;
import com.capgemini.organizeIT.permission.entities.Permission;
import com.capgemini.organizeIT.permission.services.PermissionService;
import com.capgemini.organizeIT.user.services.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
@CrossOrigin
public class PermissionController {
    private final PermissionService permissionService;
    private final UserService userService;

    public PermissionController(final PermissionService permissionService, final UserService userService) {
        this.permissionService = permissionService;
        this.userService = userService;
    }

    @PostMapping(value = "/api/permissions/{userEmail}/", consumes = "application/json", produces = "application/json")
    public Permission register(@RequestBody Permission permission, @PathVariable String userEmail) {
        permission.setHolder(userService.findByEmail(userEmail));
        log.info(permission);
        return permissionService.save(permission);
    }
}
