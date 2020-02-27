package com.capgemini.organizeIT.core.comment.adapters;

import com.capgemini.organizeIT.core.comment.model.CommentDto;

import java.util.List;
import java.util.Optional;

public interface ICommentRepository {
    CommentDto save(CommentDto commentDto);
    Optional<CommentDto> findById(Long id);

    List<CommentDto> findAllCommentsSortedByDate();

    void deleteById(Long id);
}
