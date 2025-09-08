package com.SBS.E_commerce.dto;

import com.SBS.E_commerce.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private Role role;
    private String userId;
}
