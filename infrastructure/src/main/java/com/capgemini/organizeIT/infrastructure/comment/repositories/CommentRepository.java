package com.capgemini.organizeIT.infrastructure.comment.repositories;

import com.capgemini.organizeIT.infrastructure.comment.entities.Comment;
import com.capgemini.organizeIT.infrastructure.user.entities.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    void deleteAllByAuthor(User author);

    List<Comment> findAllByArchivedFalse();

    List<Comment> findAllByAnnouncementTrueAndArchivedFalse(Sort sort);
}
