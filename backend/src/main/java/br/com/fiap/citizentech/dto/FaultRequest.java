package br.com.fiap.citizentech.dto;
import jakarta.validation.constraints.*;
public record FaultRequest(@NotBlank String message,@NotBlank String severity) {}
