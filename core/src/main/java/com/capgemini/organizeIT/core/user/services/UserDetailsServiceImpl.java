package com.capgemini.organizeIT.core.user.services;


import com.capgemini.organizeIT.infrastructure.user.entities.User;
import com.capgemini.organizeIT.infrastructure.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            log.error("User with email: {} not found", email);
            throw new UsernameNotFoundException(email);
        });
        List<GrantedAuthority> auth = user.getRoles().stream().map(authority -> new SimpleGrantedAuthority(authority.getName())).collect(Collectors.toList());
        log.info("Logged in as: {} with Roles: {}", email, auth);
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
                true, true, true, true, auth);
    }
}
