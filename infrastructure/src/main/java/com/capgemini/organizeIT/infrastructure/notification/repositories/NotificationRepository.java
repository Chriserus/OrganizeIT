package com.capgemini.organizeIT.infrastructure.notification.repositories;

import com.capgemini.organizeIT.infrastructure.notification.entities.Notification;
import com.capgemini.organizeIT.infrastructure.user.entities.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // TODO: Change Top10 to decide from frontend how many entities we want
    Set<Notification> findAllByRecipient_Id(Long id, Sort sort);

    Set<Notification> findLast10ByRecipient_Id(Long id);
    //First10ByCreatedDesc

    void deleteAllByRecipient(User recipient);
}
