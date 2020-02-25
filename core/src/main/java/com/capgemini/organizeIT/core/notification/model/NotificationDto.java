package com.capgemini.organizeIT.core.notification.model;

import com.capgemini.organizeIT.core.user.model.UserDto;
import lombok.Data;

import java.util.Date;

@Data
public class NotificationDto {
    private Long id;
    private String title;
    private String body;
    private UserDto recipient;
    private Date created;
}
