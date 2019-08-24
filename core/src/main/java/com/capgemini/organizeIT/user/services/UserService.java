package com.capgemini.organizeIT.user.services;

import com.capgemini.organizeIT.user.entities.User;
import com.capgemini.organizeIT.user.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void delete(User user) {
        userRepository.delete(user);
    }

    //TODO: Protect it somehow
    public User findById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty())
            return null;
        return user.get();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean emailAlreadyExists(User user){
        return userRepository.findByUsername(user.getUsername()) != null;
    }
}
