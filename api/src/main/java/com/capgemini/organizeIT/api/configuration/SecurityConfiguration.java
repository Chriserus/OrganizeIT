package com.capgemini.organizeIT.api.configuration;

import com.capgemini.organizeIT.core.user.services.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
    private final UserDetailsServiceImpl userDetailsService;
    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(authenticationProvider());
    }

    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/api/comments/**").authenticated()
                .antMatchers("/api/notifications/**").authenticated()
                .antMatchers("/api/projects/{projectId}/memberships/{memberId}").authenticated()
                .antMatchers("/api/projects/{projectId}/ownerships").permitAll()
                .antMatchers("/api/projects/{projectId}/ownerships/{ownerId}").authenticated()
                .antMatchers(HttpMethod.GET, "/api/projects").permitAll()
                .antMatchers(HttpMethod.POST, "/api/projects").authenticated()
                .antMatchers(HttpMethod.DELETE, "/api/projects/{id}").authenticated()
                .antMatchers(HttpMethod.PUT, "/api/projects/{id}").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT, "/api/projects").authenticated()
                .antMatchers(HttpMethod.PATCH, "/api/projects/{id}").hasRole("ADMIN")
                .antMatchers(HttpMethod.GET, "/api/event").hasRole("ADMIN")
                .antMatchers(HttpMethod.POST, "/api/events").hasRole("ADMIN")
                .antMatchers("/api/shirt-sizes").permitAll()
                .antMatchers("/api/user").permitAll()
                .antMatchers("/api/users").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/users/{userId}").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT, "/api/users/{userId}").authenticated()
                .antMatchers("/api/users/emails/{email}/").permitAll()
                .antMatchers("/api/users/{userId}/projects").authenticated()
                .antMatchers(HttpMethod.PATCH, "/api/users/{userId}").hasRole("ADMIN")
                .antMatchers("/error").permitAll()
                .antMatchers("/api/register", "/api/login").permitAll()
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(restAuthenticationEntryPoint)
                .and()
                .formLogin()
                .loginProcessingUrl("/api/login")
                .usernameParameter("email")
                .passwordParameter("password")
                .and()
                .logout().logoutUrl("/api/logout").permitAll()
                .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK))
                .and()
                .csrf().disable();
        // TODO: Dodać application-local.properties jako profil i w ustawieniach intellij odpalać z tym profilem. w nim można wyłączyć spring security - on ma priorytet nad application.properties
        //spring.security.enabled = false? aktywne profile w inntelij
    }
}
