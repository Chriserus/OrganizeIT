package com.capgemini.organizeIT.notification.repositories;

import com.capgemini.organizeIT.notification.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Set<Notification> findByRecipient_Id_OrderByCreated(Long id);
}
