package com.project.googledrive.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class ShareRequest {
    @NotBlank
    private String fileId;
    
    @NotBlank
    @Email
    private String shareWithEmail;
}