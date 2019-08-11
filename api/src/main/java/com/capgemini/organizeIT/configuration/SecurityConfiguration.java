package com.capgemini.organizeIT.configuration;

import com.capgemini.organizeIT.role.services.RoleService;
import com.capgemini.organizeIT.user.services.UserDetailsServiceImpl;
import com.capgemini.organizeIT.user.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;

import javax.sql.DataSource;

@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
//    @Autowired
//    private RoleService roleService;
//
//    @Autowired
//    private UserService userService;
//
//
//    @Bean
//    public UserDetailsService userDetailsService() {
//        return new UserDetailsServiceImpl();
//    }
//
//    @Bean
//    public DaoAuthenticationProvider authenticationProvider() {
//        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//        authProvider.setUserDetailsService(userDetailsService());
//        return authProvider;
//    }
//
//
//    @Override
//    protected void configure(AuthenticationManagerBuilder auth) {
//        auth.authenticationProvider(authenticationProvider());
//    }


    //Basic in memory authentication on form login (default) and logout on /logout
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/", "/home").access("hasRole('USER')")
                .antMatchers("/api/users").hasRole("ADMIN")
                .antMatchers("/api/projects").hasRole("USER")
                .and()
                // some more method calls
                .formLogin();
        http.logout();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth)
            throws Exception {
        auth.inMemoryAuthentication()
                .withUser("user").password("{noop}pass").roles("USER").and()
                .withUser("admin").password("{noop}pass").roles("USER","ADMIN");
        ;
    }
}
