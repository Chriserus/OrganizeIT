package com.capgemini.organizeIT.notification.services;

import com.capgemini.organizeIT.notification.entities.Notification;
import com.capgemini.organizeIT.notification.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

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

    public Set<Notification> findByUserId(Long userId) {
        return notificationRepository.findByRecipient_Id_OrderByCreated(userId);
    }
}

