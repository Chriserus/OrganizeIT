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

    @GetMapping("/comments")
    public List<Comment> findAllComments() {
        return commentService.findAll();
    }

    @PostMapping("/comments")
    public Comment register(@RequestBody Comment comment) {
        log.info(comment);
        return commentService.save(comment);
    }
}
