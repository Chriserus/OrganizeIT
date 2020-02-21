package com.capgemini.organizeIT.notification.services;

import com.capgemini.organizeIT.notification.entities.Notification;
import com.capgemini.organizeIT.notification.repositories.NotificationRepository;
import com.capgemini.organizeIT.user.entities.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public List<Notification> findAll() {
        return notificationRepository.findAll();
    }

    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> findByUser(User recipient) {
        return notificationRepository.findAll(Sort.by(Sort.Direction.DESC, "created")).stream()
                .filter(notification -> notification.getRecipient().equals(recipient)).collect(Collectors.toList());
    }

    public Optional<Notification> findById(Long id) {
        return notificationRepository.findById(id);
    }
}

