package com.capgemini.organizeIT.user.services;


import com.capgemini.organizeIT.user.entities.User;
import com.capgemini.organizeIT.user.repositories.UserRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);

        if(user == null) {
            log.error("User with login: {} not found", username);
            throw new UsernameNotFoundException(username);
        }

        List<GrantedAuthority> auth = user.getRoles().stream().map(authority -> new SimpleGrantedAuthority(authority.getName())).collect(Collectors.toList());
        log.info("Logged in as: {} with Roles: {}", username, auth);
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                true, // enabled. Use whatever condition you like
                true, // accountNonExpired. Use whatever condition you like
                true, // credentialsNonExpired. Use whatever condition you like
                true, // accountNonLocked. Use whatever condition you like
                auth);
    }

//    @Transactional(readOnly = true)
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        User user = userRepository.findByUsername(username);
//        if (user == null) {
//            throw new UsernameNotFoundException("User not found.");
//        }
//        log.info("Logged in as: {}", username);
//        log.info("User password is: {}", user.getPassword());
//        return new PdfUserDetails(user);
//    }
}
