package br.com.fiap.citizentech.config;
import br.com.fiap.citizentech.model.*;
import br.com.fiap.citizentech.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
@Configuration
public class SeedData {
 @Bean CommandLineRunner seed(ReadingRepository readings,ActuatorRepository actuators,FaultRepository faults){return args->{
  if(readings.count()==0)readings.save(new Reading(73.5,14.2,850,12.8));
  if(actuators.count()==0){actuators.save(new Actuator("Bomba hidráulica",true));actuators.save(new Actuator("Válvula de entrada",true));actuators.save(new Actuator("Iluminação técnica",false));}
  if(faults.count()==0)faults.save(new Fault("Estação iniciada; nenhum incidente crítico ativo.","INFO"));
 };}
}
