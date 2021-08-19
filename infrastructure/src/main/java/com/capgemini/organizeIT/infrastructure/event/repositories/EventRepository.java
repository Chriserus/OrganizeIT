package com.capgemini.organizeIT.infrastructure.event.repositories;

import com.capgemini.organizeIT.infrastructure.event.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
}
