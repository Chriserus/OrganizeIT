package com.capgemini.organizeIT.comment.controlers;

import com.capgemini.organizeIT.comment.entities.Comment;
import com.capgemini.organizeIT.comment.services.CommentService;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Log4j2
@RestController
@CrossOrigin
public class CommentController {
    private final CommentService commentService;

    public CommentController(final CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/api/comments")
    public List<Comment> findAllComments() {
        return commentService.findAll();
    }

    @PostMapping("/api/comments")
    public Comment register(@RequestBody Comment comment) {
        log.info(comment);
        return commentService.save(comment);
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
