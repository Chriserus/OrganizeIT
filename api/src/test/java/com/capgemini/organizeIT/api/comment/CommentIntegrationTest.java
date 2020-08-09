package com.capgemini.organizeIT.api.comment;

import com.capgemini.organizeIT.api.comment.controlers.CommentController;
import com.capgemini.organizeIT.core.comment.model.CommentDto;
import com.capgemini.organizeIT.core.user.model.UserDto;
import org.junit.Ignore;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.mock;

@RunWith(SpringRunner.class)
@DataJpaTest
@Ignore
public class CommentIntegrationTest {

    @Autowired
    private CommentController commentController;

    @Test
    public void shouldContainTestUser() {
        // given
        CommentDto comment = new CommentDto();
        comment.setAnnouncement(false);
        comment.setContent("This is test comment content");
        comment.setAuthor(mock(UserDto.class));
        // when
        commentController.register(comment);

        // then
        assertThat(commentController.findAllComments().getBody(), hasSize(1));
    }
}
