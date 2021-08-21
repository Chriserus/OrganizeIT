package com.capgemini.organizeIT.infrastructure.banner.entities;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Lob
    private byte[] file;
    private Boolean active = false;
    @CreationTimestamp
    private Date created;
    @UpdateTimestamp
    private Date modified;
}