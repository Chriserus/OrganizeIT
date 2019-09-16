package com.capgemini.organizeIT.comment.repositories;

import com.capgemini.organizeIT.comment.entities.Comment;
import com.capgemini.organizeIT.user.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByAuthor(User author);
}
