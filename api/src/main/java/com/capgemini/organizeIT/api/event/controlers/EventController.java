package com.capgemini.organizeIT.api.event.controlers;

import com.capgemini.organizeIT.api.event.mappers.EventMapper;
import com.capgemini.organizeIT.core.banner.services.BannerService;
import com.capgemini.organizeIT.core.comment.services.CommentService;
import com.capgemini.organizeIT.core.event.model.EventDto;
import com.capgemini.organizeIT.core.event.services.EventService;
import com.capgemini.organizeIT.core.project.services.ProjectService;
import com.capgemini.organizeIT.infrastructure.comment.entities.Comment;
import com.capgemini.organizeIT.infrastructure.event.entities.Event;
import com.capgemini.organizeIT.infrastructure.project.entities.Project;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;

@Log4j2
@CrossOrigin
@RestController
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;
    private final EventMapper eventMapper;
    private final ProjectService projectService;
    private final CommentService commentService;
    private final BannerService bannerService;

    @GetMapping(value = "/api/event", produces = "text/csv")
    public ResponseEntity<InputStreamResource> exportEvent() {
        String csvFileName = "event.csv";
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + csvFileName);
        headers.set(HttpHeaders.CONTENT_TYPE, "text/csv");
        return new ResponseEntity<>(eventService.exportCSV(), headers, HttpStatus.OK);
    }

    @PostMapping("/api/events")
    public ResponseEntity<EventDto> addEvent(@RequestBody EventDto eventDto) {
        log.info("Creating event with title: {}", eventDto.getTitle());
        Event event = eventMapper.convertToEntity(eventDto);
        List<Project> projects = projectService.findAllByArchivedFalseSortByDateNewFirst();
        event.setProjects(new HashSet<>(projects));
        projects.forEach(project -> {
            project.setEvent(event);
            project.setArchived(true);
        });
        List<Comment> comments = commentService.findAllByArchivedFalse();
        event.setComments(new HashSet<>(comments));
        comments.forEach(comment -> {
            comment.setEvent(event);
            comment.setArchived(true);
        });
        event.setBanner(bannerService.findActiveBanner().orElse(null));
        eventService.save(event);
        return ResponseEntity.ok(eventMapper.convertToDto(event));
    }

}