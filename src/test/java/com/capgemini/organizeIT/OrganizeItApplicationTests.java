package com.capgemini.organizeIT;

import com.capgemini.organizeIT.entities.User;
import com.capgemini.organizeIT.services.UserService;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest
public class OrganizeItApplicationTests {

    @Autowired
    private UserService userService;
    private User testUser;

    @Before
    public void createTestUser() {
        testUser = new User();
        testUser.setUsername("TestUsername");
        userService.save(testUser);
    }

    @After
    public void deleteTestUser() {
        userService.delete(testUser);
    }

    @Test
    public void shouldContainTestUser() {
        List<String> users = userService.findAll().stream().map(User::getUsername).collect(Collectors.toList());
        assertTrue(users.contains(testUser.getUsername()));
    }
}
