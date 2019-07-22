package com.capgemini.organizeIT;

import com.capgemini.organizeIT.entities.User;
import com.capgemini.organizeIT.services.UserService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class OrganizeItApplicationTests {

    @Autowired
    private UserService userService;

	@Test
	public void contextLoads() {
	}

	@Test
    public void shouldGiveListOfUsersLocatedInDatabase(){
	    List<User> users = userService.list();
	    users.forEach(user -> System.out.println(user.getUsername()));
    }

}
