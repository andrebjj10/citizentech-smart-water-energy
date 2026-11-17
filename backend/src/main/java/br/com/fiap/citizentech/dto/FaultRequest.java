package br.com.fiap.citizentech.dto;
import jakarta.validation.constraints.*;
public record FaultRequest(@NotBlank @Size(max = 255) String message,
                           @NotBlank @Size(max = 8) String severity) {}
