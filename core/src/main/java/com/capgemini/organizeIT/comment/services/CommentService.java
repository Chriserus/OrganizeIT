package com.capgemini.organizeIT.comment.services;

import com.capgemini.organizeIT.comment.model.CommentDto;
import com.capgemini.organizeIT.comment.repository.ICommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final ICommentRepository commentRepository;

    public CommentService(final ICommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    //
    public List<CommentDto> findAll() {
        return commentRepository.findAllSortedDescending();
    }

    // once we switch from Entity to dto object there will be more logic then only save, so I would rename to the same name as in controller
    public CommentDto save(CommentDto comment) {
        return commentRepository.save(comment);
    }
}
