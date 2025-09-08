package com.SBS.E_commerce.dto;

import com.SBS.E_commerce.entity.Role;
import com.SBS.E_commerce.entity.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private String userId;
    private String name;
    private String email;
    private String phoneNumber;

}
