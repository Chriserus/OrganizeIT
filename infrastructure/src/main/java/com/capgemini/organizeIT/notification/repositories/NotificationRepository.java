package com.capgemini.organizeIT.notification.repositories;

import com.capgemini.organizeIT.notification.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // TODO: Change Top10 to decide from frontend how many entities we want
    Set<Notification> findTop10ByRecipient_Id_OrderByCreatedDesc(Long id);
}
