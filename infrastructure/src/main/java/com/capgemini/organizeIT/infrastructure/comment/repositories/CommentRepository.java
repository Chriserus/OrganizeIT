package com.capgemini.organizeIT.infrastructure.comment.repositories;

import com.capgemini.organizeIT.infrastructure.comment.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
}
