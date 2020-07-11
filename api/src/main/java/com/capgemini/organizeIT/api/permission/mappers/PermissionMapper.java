package com.capgemini.organizeIT.api.permission.mappers;

import com.capgemini.organizeIT.core.permission.model.PermissionDto;
import com.capgemini.organizeIT.core.permission.services.PermissionService;
import com.capgemini.organizeIT.infrastructure.permission.entities.Permission;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class PermissionMapper {
    private final ModelMapper modelMapper;
    private final PermissionService permissionService;

    public Permission convertToEntity(PermissionDto permissionDto) {
        Permission permission = modelMapper.map(permissionDto, Permission.class);
        Optional.ofNullable(permissionDto.getId()).flatMap(permissionService::findById).map(Permission::getId).ifPresent(permission::setId);
        return permission;
    }

    public PermissionDto convertToDto(Permission permission) {
        return modelMapper.map(permission, PermissionDto.class);
    }
}
