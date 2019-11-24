package com.capgemini.organizeIT.comment.controlers;

import com.capgemini.organizeIT.comment.model.CommentDto;
import com.capgemini.organizeIT.comment.services.CommentService;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
    public List<CommentDto> findAllComments() {
        return commentService.findAll();
    }

    // maybe we shoul consider renaming this method to addComment?
    @PostMapping("/api/comments")
    public CommentDto register(@RequestBody CommentDto comment) {
        // logging every reuest on info level is not good idea, if you need it for development it's better to set log on debug level
        log.info(comment);
        return commentService.save(comment);
    }
}
