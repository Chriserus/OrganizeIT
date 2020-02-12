package com.capgemini.organizeIT.notification.mappers;

import com.capgemini.organizeIT.notification.entities.Notification;
import com.capgemini.organizeIT.notification.model.NotificationDto;
import com.capgemini.organizeIT.notification.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class NotificationMapper {
    private final ModelMapper modelMapper;
    private final NotificationService notificationService;

    public Notification convertToEntity(NotificationDto notificationDto) {
        Notification notification = modelMapper.map(notificationDto, Notification.class);
        if (notificationDto.getId() != null) {
            Notification oldNotification = notificationService.findById(notificationDto.getId()).get();
            notification.setId(oldNotification.getId());
        }
        return notification;
    }

    public NotificationDto convertToDto(Notification notification) {
        return modelMapper.map(notification, NotificationDto.class);
    }
}
