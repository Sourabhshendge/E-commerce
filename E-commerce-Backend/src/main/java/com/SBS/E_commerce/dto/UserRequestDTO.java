package com.SBS.E_commerce.dto;

import com.SBS.E_commerce.entity.Role;
import com.SBS.E_commerce.entity.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequestDTO {
    private String name;
    private String email;
    private String password;
    private String phoneNumber;

}