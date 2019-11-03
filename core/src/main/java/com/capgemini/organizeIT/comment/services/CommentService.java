package com.capgemini.organizeIT.comment.services;

import com.capgemini.organizeIT.comment.entities.Comment;
import com.capgemini.organizeIT.comment.repositories.CommentRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentService(final CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List<Comment> findAll() {
        return commentRepository.findAll(Sort.by(Sort.Direction.DESC, "created"));
    }

    public Comment save(Comment comment) {
        return commentRepository.save(comment);
    }
}
