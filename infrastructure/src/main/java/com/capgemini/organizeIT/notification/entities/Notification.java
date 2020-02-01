package com.capgemini.organizeIT.notification.entities;

import com.capgemini.organizeIT.user.entities.User;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String body;
    @ManyToOne
    @JoinColumn(name = "recipient")
    private User recipient;
    @CreationTimestamp
    private Date created;
}
