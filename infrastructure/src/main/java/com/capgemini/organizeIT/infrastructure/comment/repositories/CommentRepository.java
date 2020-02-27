package com.capgemini.organizeIT.infrastructure.comment.repositories;

import com.capgemini.organizeIT.core.comment.adapters.ICommentRepository;
import com.capgemini.organizeIT.core.comment.model.CommentDto;
import com.capgemini.organizeIT.infrastructure.comment.entities.Comment;
import com.capgemini.organizeIT.infrastructure.comment.mappers.CommentMapper;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@AllArgsConstructor
public class CommentRepository implements ICommentRepository {
    private final CommentJpaRepository commentJpaRepository;
    private final CommentMapper commentMapper;

    @Override
    public CommentDto save(CommentDto commentDto) {
        Comment savedComment = commentJpaRepository.save(commentMapper.convertToEntity(commentDto));
        return commentMapper.convertToDto(savedComment);
    }

    @Override
    public Optional<CommentDto> findById(Long id) {
        return commentJpaRepository.findById(id).map(commentMapper::convertToDto);
    }

    @Override
    public List<CommentDto> findAllCommentsSortedByDate() {
        return commentJpaRepository.findAll(Sort.by(Sort.Direction.DESC, "created")).stream().map(commentMapper::convertToDto).collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        commentJpaRepository.deleteById(id);
    }
}
