package com.capgemini.organizeIT.api.comment.controlers;


import com.capgemini.organizeIT.api.comment.mappers.CommentMapper;
import com.capgemini.organizeIT.core.comment.model.CommentDto;
import com.capgemini.organizeIT.core.comment.services.CommentService;
import com.capgemini.organizeIT.core.user.services.UserService;
import com.capgemini.organizeIT.infrastructure.comment.entities.Comment;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@RestController
@CrossOrigin
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    private final CommentMapper commentMapper;
    private final UserService userService;

    @GetMapping("/api/comments")
    public List<CommentDto> findAllComments() {
        return commentService.findAll().stream().map(commentMapper::convertToDto).collect(Collectors.toList());
    }

    @PostMapping("/api/comments")
    public CommentDto register(@RequestBody CommentDto commentDto) {
        if (userService.loggedInUserIsNotAdmin()) {
            commentDto.setAnnouncement(false);
        }
        Comment comment = commentMapper.convertToEntity(commentDto);
        return commentMapper.convertToDto(commentService.save(comment));
    }

    @DeleteMapping("/api/comments/{id}")
    public void deleteComment(@PathVariable Long id, Principal principal) {
        commentService.findById(id).ifPresent(comment -> {
            if (principal.getName().equals(comment.getAuthor().getEmail()) || !userService.loggedInUserIsNotAdmin()) {
                log.info("Deleting comment: {}", comment);
                commentService.deleteById(id);
            }
        });
    }

}
