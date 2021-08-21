package com.capgemini.organizeIT.core.banner.model;

import lombok.Data;

import java.util.Date;

@Data
public class BannerDto {
    private Long id;
    private String name;
    private byte[] file;
    private Boolean active;
    private Date created;
    private Date modified;
}