package com.capgemini.organizeIT.comment.repository;

import com.capgemini.organizeIT.comment.model.CommentDto;

import java.util.List;

public interface ICommentRepository {

    CommentDto save(CommentDto comment);

    List<CommentDto> findAllSortedDescending();
}
