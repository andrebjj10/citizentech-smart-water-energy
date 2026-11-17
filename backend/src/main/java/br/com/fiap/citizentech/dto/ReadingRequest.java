package br.com.fiap.citizentech.dto;
import jakarta.validation.constraints.*;
public record ReadingRequest(@NotNull @DecimalMin("0") @DecimalMax("100") Double waterLevel,
 @NotNull @DecimalMin("0") Double flowRate,
 @NotNull @DecimalMin("0") Double powerWatts,
 @NotNull @DecimalMin("0") Double energyKwh) {}
