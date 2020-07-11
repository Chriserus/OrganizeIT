package com.capgemini.organizeIT.api.notification.mappers;

import com.capgemini.organizeIT.core.notification.model.NotificationDto;
import com.capgemini.organizeIT.core.notification.services.NotificationService;
import com.capgemini.organizeIT.infrastructure.notification.entities.Notification;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class NotificationMapper {
    private final ModelMapper modelMapper;
    private final NotificationService notificationService;

    public Notification convertToEntity(NotificationDto notificationDto) {
        Notification notification = modelMapper.map(notificationDto, Notification.class);
        Optional.ofNullable(notificationDto.getId()).flatMap(notificationService::findById).map(Notification::getId).ifPresent(notification::setId);
        return notification;
    }

    public NotificationDto convertToDto(Notification notification) {
        return modelMapper.map(notification, NotificationDto.class);
    }
}
