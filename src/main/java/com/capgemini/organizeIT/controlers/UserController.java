package com.capgemini.organizeIT.controlers;

import com.capgemini.organizeIT.entities.User;
import com.capgemini.organizeIT.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public List<User> allUsers() {
        return userService.findAll();
    }

    @GetMapping("/users/{id}")
    public User user(@PathVariable Long id) {
        return userService.findById(id);
    }

    //TODO: which method is better?
//    @RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
//    public User user(@RequestParam(value="id") Long id){
//        return userService.findById(id);
//    }
}
