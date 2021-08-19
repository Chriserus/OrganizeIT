package com.capgemini.organizeIT.core.user.services;

import com.capgemini.organizeIT.infrastructure.comment.repositories.CommentRepository;
import com.capgemini.organizeIT.infrastructure.notification.repositories.NotificationRepository;
import com.capgemini.organizeIT.infrastructure.permission.repositories.PermissionRepository;
import com.capgemini.organizeIT.infrastructure.user.entities.User;
import com.capgemini.organizeIT.infrastructure.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final NotificationRepository notificationRepository;
    private final PermissionRepository permissionRepository;

    public List<User> findAll() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "created"));
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void delete(User user) {
        commentRepository.deleteAllByAuthor(user);
        notificationRepository.deleteAllByRecipient(user);
        permissionRepository.deleteAllByHolder(user);
        user.getOwnerships().clear();
        user.getMemberships().clear();
        userRepository.delete(user);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean loggedInUserIsNotAdmin() {
        return !SecurityContextHolder.getContext().getAuthentication().getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }
}
