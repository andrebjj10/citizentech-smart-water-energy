package br.com.fiap.citizentech.model;
import jakarta.persistence.*;
@Entity @Table(name="actuators")
public class Actuator {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true) private String name;
 @Column(nullable=false) private boolean enabled;
 protected Actuator() {}
 public Actuator(String name,boolean enabled){this.name=name;this.enabled=enabled;}
 public Long getId(){return id;} public String getName(){return name;} public boolean isEnabled(){return enabled;} public void setEnabled(boolean enabled){this.enabled=enabled;}
}
