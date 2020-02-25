package com.capgemini.organizeIT.api.comment.mappers;

import com.capgemini.organizeIT.infrastructure.comment.entities.Comment;
import com.capgemini.organizeIT.core.comment.model.CommentDto;
import com.capgemini.organizeIT.core.comment.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CommentMapper {
    private final ModelMapper modelMapper;
    private final CommentService commentService;

    public Comment convertToEntity(CommentDto commentDto) {
        Comment comment = modelMapper.map(commentDto, Comment.class);
        if (commentDto.getId() != null) {
            Comment oldComment = commentService.findById(commentDto.getId()).get();
            comment.setId(oldComment.getId());
        }
        return comment;
    }

    public CommentDto convertToDto(Comment comment) {
        return modelMapper.map(comment, CommentDto.class);
    }
}
