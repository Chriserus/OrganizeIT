package com.capgemini.organizeIT.api.permission.mappers;

import com.capgemini.organizeIT.infrastructure.permission.entities.Permission;
import com.capgemini.organizeIT.core.permission.model.PermissionDto;
import com.capgemini.organizeIT.core.permission.services.PermissionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PermissionMapper {
    private final ModelMapper modelMapper;
    private final PermissionService permissionService;

    public Permission convertToEntity(PermissionDto permissionDto) {
        Permission permission = modelMapper.map(permissionDto, Permission.class);
        if (permissionDto.getId() != null) {
            Permission oldPermission = permissionService.findById(permissionDto.getId()).get();
            permission.setId(oldPermission.getId());
        }
        return permission;
    }

    public PermissionDto convertToDto(Permission permission) {
        return modelMapper.map(permission, PermissionDto.class);
    }
}
