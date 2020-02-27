package com.capgemini.organizeIT.infrastructure.comment.repositories;

import com.capgemini.organizeIT.infrastructure.comment.entities.Comment;
import com.capgemini.organizeIT.infrastructure.user.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentJpaRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByAuthor(User author);
}
