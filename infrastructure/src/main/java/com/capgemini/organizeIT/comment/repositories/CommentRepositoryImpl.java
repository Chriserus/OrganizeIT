package com.capgemini.organizeIT.comment.repositories;

import com.capgemini.organizeIT.comment.mappers.CommentMapper;
import com.capgemini.organizeIT.comment.model.CommentDto;
import com.capgemini.organizeIT.comment.repositories.jpa.CommentRepository;
import com.capgemini.organizeIT.comment.repository.ICommentRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentRepositoryImpl implements ICommentRepository {

    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;

    public CommentRepositoryImpl(final CommentRepository commentRepository,
                                 final CommentMapper commentMapper) {
        this.commentRepository = commentRepository;
        this.commentMapper = commentMapper;
    }

    @Override
    public CommentDto save(CommentDto comment) {
        return commentMapper.updateSavedComment(comment, commentRepository.save(commentMapper.mapDtoToEntity(comment)));
    }

    @Override
    public List<CommentDto> findAllSortedDescending() {
        // what about performance? ;)
        return commentMapper.mapEntitiesToDtos(commentRepository.findAll(Sort.by(Sort.Direction.DESC, "created")));
    }
}
