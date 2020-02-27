package com.capgemini.organizeIT.api.comment.controlers;


import com.capgemini.organizeIT.core.comment.model.CommentDto;
import com.capgemini.organizeIT.core.comment.services.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Log4j2
@RestController
@CrossOrigin
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping("/api/comments")
    public List<CommentDto> findAllComments() {
        return commentService.findAll();
    }

    @PostMapping("/api/comments")
    public CommentDto register(@RequestBody CommentDto commentDto) {
        return commentService.createOrUpdate(commentDto);
    }

    @DeleteMapping("/api/comments/{id}")
    public void deleteComment(@PathVariable Long id, Principal principal) {
        commentService.findById(id).ifPresent(comment -> {
            if (principal.getName().equals(comment.getAuthor().getEmail()) || loggedInUserIsAdmin()) {
                log.info("Deleting comment: {}", comment);
                commentService.deleteById(id);
            }
        });
    }

    private boolean loggedInUserIsAdmin() {
        return !SecurityContextHolder.getContext().getAuthentication().getAuthorities().contains(new SimpleGrantedAuthority("ADMIN"));
    }
}
