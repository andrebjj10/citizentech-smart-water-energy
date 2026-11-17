package br.com.fiap.citizentech.controller;
import br.com.fiap.citizentech.dto.*;
import br.com.fiap.citizentech.model.*;
import br.com.fiap.citizentech.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
@RestController @RequestMapping("/api") @CrossOrigin(origins="*")
public class StationController {
 private final ReadingRepository readings; private final ActuatorRepository actuators; private final FaultRepository faults;
 public StationController(ReadingRepository readings,ActuatorRepository actuators,FaultRepository faults){this.readings=readings;this.actuators=actuators;this.faults=faults;}
 @GetMapping("/health") public Map<String,String> health(){return Map.of("status","online","station","Smart Water & Energy Station");}
 @GetMapping("/readings") public List<Reading> readings(){return readings.findTop30ByOrderByRecordedAtDescIdDesc();}
 @GetMapping("/readings/latest") public Reading latest(){return readings.findTopByOrderByRecordedAtDescIdDesc().orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Sem leituras"));}
 @PostMapping("/readings") @ResponseStatus(HttpStatus.CREATED)
 public Reading createReading(@Valid @RequestBody ReadingRequest r){
   if(!Double.isFinite(r.waterLevel()) || !Double.isFinite(r.flowRate()) || !Double.isFinite(r.powerWatts()) || !Double.isFinite(r.energyKwh())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Valores devem ser finitos");
   Reading saved=readings.save(new Reading(r.waterLevel(),r.flowRate(),r.powerWatts(),r.energyKwh()));
   if(r.waterLevel()<15) faults.save(new Fault("Nível de água crítico: "+r.waterLevel()+"%","CRITICAL"));
   if(r.flowRate()>35) faults.save(new Fault("Vazão acima do limite: "+r.flowRate()+" L/min","WARNING"));
   if(r.powerWatts()>1800) faults.save(new Fault("Consumo elétrico elevado: "+r.powerWatts()+" W","WARNING"));
   return saved;
 }
 @GetMapping("/actuators") public List<Actuator> actuators(){return actuators.findAll();}
 @PutMapping("/actuators/{id}") public Actuator updateActuator(@PathVariable Long id,@Valid @RequestBody ActuatorRequest request){
   Actuator a=actuators.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Atuador não encontrado"));
   a.setEnabled(request.enabled());return actuators.save(a);
 }
 @GetMapping("/faults") public List<Fault> faults(){return faults.findTop30ByOrderByRecordedAtDescIdDesc();}
 @PostMapping("/faults") @ResponseStatus(HttpStatus.CREATED) public Fault createFault(@Valid @RequestBody FaultRequest request){
   String severity=request.severity().toUpperCase(Locale.ROOT);
   if(!Set.of("INFO","WARNING","CRITICAL").contains(severity))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Severidade inválida: INFO, WARNING ou CRITICAL");
   return faults.save(new Fault(request.message(),severity));
 }
}
