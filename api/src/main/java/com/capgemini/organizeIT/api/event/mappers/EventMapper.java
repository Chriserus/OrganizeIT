package com.capgemini.organizeIT.api.event.mappers;

import com.capgemini.organizeIT.core.event.model.EventDto;
import com.capgemini.organizeIT.core.event.services.EventService;
import com.capgemini.organizeIT.infrastructure.event.entities.Event;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class EventMapper {
    private final ModelMapper modelMapper;
    private final EventService eventService;

    public Event convertToEntity(EventDto eventDto) {
        Event event = modelMapper.map(eventDto, Event.class);
        Optional.ofNullable(eventDto.getId()).flatMap(eventService::findById).map(Event::getId).ifPresent(event::setId);
        return event;
    }

    public EventDto convertToDto(Event event) {
        return modelMapper.map(event, EventDto.class);
    }
}
