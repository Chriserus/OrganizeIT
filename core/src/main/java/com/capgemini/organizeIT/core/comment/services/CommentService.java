package com.capgemini.organizeIT.core.comment.services;

import com.capgemini.organizeIT.core.comment.adapters.ICommentRepository;
import com.capgemini.organizeIT.core.comment.model.CommentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final ICommentRepository iCommentRepository;

    public List<CommentDto> findAll() {
        return iCommentRepository.findAllCommentsSortedByDate();
    }

    public CommentDto createOrUpdate(CommentDto commentDto) {
        if (commentDto.getId() != null) {
            return updateComment(commentDto);
        }
        return iCommentRepository.save(commentDto);
    }

    private CommentDto updateComment(CommentDto commentDto) {
        Optional<CommentDto> oldComment = iCommentRepository.findById(commentDto.getId());
        if (oldComment.isPresent()) {
            commentDto.setId(oldComment.get().getId());
        }
        return iCommentRepository.save(commentDto);
    }

    public Optional<CommentDto> findById(Long id) {
        return iCommentRepository.findById(id);
    }

    public void deleteById(Long id) {
        iCommentRepository.deleteById(id);
    }
}
