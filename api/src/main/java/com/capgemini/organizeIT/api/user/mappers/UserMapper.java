package com.capgemini.organizeIT.api.user.mappers;

import com.capgemini.organizeIT.infrastructure.user.entities.User;
import com.capgemini.organizeIT.core.user.model.AuthDto;
import com.capgemini.organizeIT.core.user.model.UserDto;
import com.capgemini.organizeIT.core.user.services.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserMapper {
    private final ModelMapper modelMapper;
    private final UserService userService;

    public User convertToEntity(AuthDto authDto){
        User user = modelMapper.map(authDto, User.class);
        if (authDto.getId() != null) {
            User oldUser = userService.findById(authDto.getId());
            user.setId(oldUser.getId());
        }
        return user;
    }

    public User convertToEntity(UserDto userDto) {
        User user = modelMapper.map(userDto, User.class);
        if (userDto.getId() != null) {
            User oldUser = userService.findById(userDto.getId());
            user.setId(oldUser.getId());
        }
        return user;
    }

    public UserDto convertToDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }
}
