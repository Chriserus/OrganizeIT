package com.capgemini.organizeIT.comment.mappers;

import com.capgemini.organizeIT.comment.entities.Comment;
import com.capgemini.organizeIT.comment.model.CommentDto;
import com.capgemini.organizeIT.user.entities.User;

import java.util.List;
import java.util.stream.Collectors;

public class CommentMapper {

    public Comment mapDtoToEntity(CommentDto commentDto) {
        final User usr = new User();
        usr.setId(commentDto.getAuthorId());
        return Comment.builder()
                .id(commentDto.getId())
                .content(commentDto.getContent())
                .announcement(commentDto.getAnnouncement())
                .author(usr)
                .build();
    }

    public CommentDto updateSavedComment(CommentDto commentToUpdate, Comment savedComment) {
        commentToUpdate.setId(savedComment.getId());
        commentToUpdate.setCreated(savedComment.getCreated());
        commentToUpdate.setModified(savedComment.getModified());
        return commentToUpdate;
    }

    public List<CommentDto> mapEntitiesToDtos(List<Comment> comments) {
        return comments.stream().map(comment -> mapEntityToDto(comment)).collect(Collectors.toList());
    }

    private CommentDto mapEntityToDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .announcement(comment.getAnnouncement())
                .authorId(comment.getAuthor().getId())
                .modified(comment.getModified())
                .created(comment.getCreated()).build();
    }
}
