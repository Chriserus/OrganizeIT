package com.capgemini.organizeIT.comment.controlers;

import com.capgemini.organizeIT.comment.entities.Comment;
import com.capgemini.organizeIT.comment.services.CommentService;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping(value = "/api/comments", consumes = "application/json", produces = "application/json")
    public Comment register(@RequestBody Comment newComment) {
        log.info(newComment);
        return commentService.save(newComment);
    }
}