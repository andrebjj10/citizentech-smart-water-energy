package br.com.fiap.citizentech.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="readings")
public class Reading {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private double waterLevel;
 @Column(nullable=false) private double flowRate;
 @Column(nullable=false) private double powerWatts;
 @Column(nullable=false) private double energyKwh;
 @Column(nullable=false) private LocalDateTime recordedAt;
 protected Reading() {}
 public Reading(double waterLevel,double flowRate,double powerWatts,double energyKwh){this.waterLevel=waterLevel;this.flowRate=flowRate;this.powerWatts=powerWatts;this.energyKwh=energyKwh;this.recordedAt=LocalDateTime.now();}
 public Long getId(){return id;} public double getWaterLevel(){return waterLevel;} public double getFlowRate(){return flowRate;} public double getPowerWatts(){return powerWatts;} public double getEnergyKwh(){return energyKwh;} public LocalDateTime getRecordedAt(){return recordedAt;}
}
