package com.capgemini.organizeIT.core.comment.services;

import com.capgemini.organizeIT.infrastructure.comment.entities.Comment;
import com.capgemini.organizeIT.infrastructure.comment.repositories.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public List<Comment> findAll() {
        return commentRepository.findAll(Sort.by(Sort.Direction.DESC, "created"));
    }

    public Comment save(Comment comment) {
        return commentRepository.save(comment);
    }

    public Optional<Comment> findById(Long id) {
        return commentRepository.findById(id);
    }

    public void deleteById(Long id) {
        commentRepository.deleteById(id);
    }
}
