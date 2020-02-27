package com.capgemini.organizeIT.infrastructure.comment.mappers;

import com.capgemini.organizeIT.core.comment.model.CommentDto;
import com.capgemini.organizeIT.infrastructure.comment.entities.Comment;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CommentMapper {
    private final ModelMapper modelMapper;

    public Comment convertToEntity(CommentDto commentDto) {
        return modelMapper.map(commentDto, Comment.class);
    }

    public CommentDto convertToDto(Comment comment) {
        return modelMapper.map(comment, CommentDto.class);
    }
}
