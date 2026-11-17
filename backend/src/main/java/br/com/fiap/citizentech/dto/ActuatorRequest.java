package br.com.fiap.citizentech.dto;
import jakarta.validation.constraints.NotNull;
public record ActuatorRequest(@NotNull Boolean enabled) {}
