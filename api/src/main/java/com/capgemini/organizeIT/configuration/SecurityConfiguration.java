package com.capgemini.organizeIT.configuration;

import com.capgemini.organizeIT.user.services.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private UserDetailsServiceImpl userDetailsService;

    public SecurityConfiguration(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        return authProvider;
    }


    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(authenticationProvider());
    }


    //Basic authentication using form login (default) and logout on /logout
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/", "/home").access("hasRole('USER')")
                .antMatchers("/api/users").hasRole("ADMIN")
                .antMatchers("/api/users/*").hasRole("USER")
                .antMatchers("/api/projects").hasRole("USER")
                .antMatchers("/**").authenticated()
                .and()
                // some more method calls
                .formLogin()
                .loginProcessingUrl("/api/login")
                .usernameParameter("email")
                .passwordParameter("password")
                .and()
                .logout().logoutUrl("/api/logout")
                .and()
                .csrf().disable();
        // TODO: Dodać application-local.properties jako profil i w ustawieniach intellij odpalać z tym profilem. w nim można wyłączyć spring security - on ma priorytet nad application.properties
        //spring.security.enabled = false? aktywne profile w inntelij
    }
    //Basic in memory authentication
//    @Autowired
//    public void configureGlobal(AuthenticationManagerBuilder auth)
//            throws Exception {
//        auth.inMemoryAuthentication()
//                .withUser("user").password("{noop}pass").roles("USER").and()
//                .withUser("admin").password("{noop}pass").roles("USER","ADMIN");
//        ;
//    }

}
