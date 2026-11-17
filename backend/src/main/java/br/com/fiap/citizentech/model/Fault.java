package br.com.fiap.citizentech.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="faults")
public class Fault {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String message;
 @Column(nullable=false) private String severity;
 @Column(nullable=false) private LocalDateTime recordedAt;
 protected Fault() {}
 public Fault(String message,String severity){this.message=message;this.severity=severity;this.recordedAt=LocalDateTime.now();}
 public Long getId(){return id;} public String getMessage(){return message;} public String getSeverity(){return severity;} public LocalDateTime getRecordedAt(){return recordedAt;}
}
