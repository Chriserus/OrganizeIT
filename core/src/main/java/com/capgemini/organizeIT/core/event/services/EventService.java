package com.capgemini.organizeIT.core.event.services;

import com.capgemini.organizeIT.infrastructure.comment.repositories.CommentRepository;
import com.capgemini.organizeIT.infrastructure.event.entities.Event;
import com.capgemini.organizeIT.infrastructure.event.repositories.EventRepository;
import com.capgemini.organizeIT.infrastructure.project.entities.Membership;
import com.capgemini.organizeIT.infrastructure.project.entities.Ownership;
import com.capgemini.organizeIT.infrastructure.project.entities.Project;
import com.capgemini.organizeIT.infrastructure.project.repositories.ProjectRepository;
import com.capgemini.organizeIT.infrastructure.user.entities.User;
import com.capgemini.organizeIT.infrastructure.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public Optional<Event> findById(Long id) {
        return eventRepository.findById(id);
    }

    public InputStreamResource exportCSV() {
        ByteArrayInputStream byteArrayOutputStream;
        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), CSVFormat.DEFAULT.withHeader(createCSVHeader()))) {
            createCSVBody().forEach(record -> {
                try {
                    csvPrinter.printRecord(record);
                } catch (IOException e) {
                    throw new RuntimeException(e.getMessage());
                }
            });
            csvPrinter.flush();
            byteArrayOutputStream = new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }
        return new InputStreamResource(byteArrayOutputStream);
    }

    private String[] createCSVHeader() {
        return new String[]{
                "firstName", "lastName", "email", "city", "shirtType", "shirtSize", "foodPreferences",
                "projectTitle", "projectStatus", "projectCity"
        };
    }

    private List<List<String>> createCSVBody() {
        return userRepository.findAll().stream().map(user ->
                Stream.of(getUserInfo(user), getProjectInfo(user))
                        .flatMap(Collection::stream)
                        .collect(Collectors.toList())
        ).collect(Collectors.toList());
    }

    private List<String> getUserInfo(User user) {
        return Arrays.asList(user.getFirstName(), user.getLastName(), user.getEmail(),
                user.getCity().toString(), user.getShirtType().toString(), user.getShirtSize().getSize(), user.getFoodPreferences());
    }

    private List<String> getProjectInfo(User user) {
        List<String> projectInfo = new ArrayList<>();

        user.getMemberships().stream().filter(Membership::getApproved).map(Membership::getProject).findAny().ifPresent(project -> {
            projectInfo.add(project.getTitle());
            projectInfo.add(getProjectStatus(project));
            projectInfo.add(project.getCity().toString());
        });

        //TODO: This overrides membership with ownership
        user.getOwnerships().stream().map(Ownership::getProject).findAny().ifPresent(project -> {
            projectInfo.clear();
            projectInfo.add(project.getTitle());
            projectInfo.add(getProjectStatus(project));
            projectInfo.add(project.getCity().toString());
        });
        return projectInfo;
    }

    private String getProjectStatus(Project project) {
        //TODO: Note to self, projectStatus should be an enum
        if (project.getVerified()) {
            return "VERIFIED";
        } else if (project.getConfirmed()) {
            return "CONFIRMED";
        } else {
            return "UNVERIFIED";
        }
    }

    public Event save(Event event) {
        return eventRepository.save(event);
    }
}
