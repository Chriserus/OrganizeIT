package com.capgemini.organizeIT.api.user.mappers;

import com.capgemini.organizeIT.core.user.model.AuthDto;
import com.capgemini.organizeIT.core.user.model.UserDto;
import com.capgemini.organizeIT.core.user.services.UserService;
import com.capgemini.organizeIT.infrastructure.user.entities.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserMapper {
    private final ModelMapper modelMapper;
    private final UserService userService;

    public User convertToEntity(AuthDto authDto) {
        User user = modelMapper.map(authDto, User.class);
        Optional.ofNullable(authDto.getId()).map(userService::findById).map(User::getId).ifPresent(user::setId);
        return user;
    }

    public UserDto convertToDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }
}
