package br.com.fiap.citizentech.controller;
import br.com.fiap.citizentech.dto.*;
import br.com.fiap.citizentech.model.*;
import br.com.fiap.citizentech.service.StationService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api") @CrossOrigin(origins="*")
public class StationController {
 private final StationService service;
 public StationController(StationService service){this.service=service;}
 @GetMapping("/health") public Map<String,String> health(){return Map.of("status","online","station","Smart Water & Energy Station");}
 @GetMapping("/readings") public List<Reading> readings(){return service.readings();}
 @GetMapping("/readings/latest") public Reading latest(){return service.latest();}
 @PostMapping("/readings") @ResponseStatus(HttpStatus.CREATED)
 public Reading createReading(@Valid @RequestBody ReadingRequest r){
   return service.createReading(r);
 }
 @GetMapping("/actuators") public List<Actuator> actuators(){return service.actuators();}
 @PutMapping("/actuators/{id}") public Actuator updateActuator(@PathVariable Long id,@Valid @RequestBody ActuatorRequest request){
   return service.updateActuator(id,request);
 }
 @GetMapping("/faults") public List<Fault> faults(){return service.faults();}
 @PostMapping("/faults") @ResponseStatus(HttpStatus.CREATED) public Fault createFault(@Valid @RequestBody FaultRequest request){
   return service.createFault(request);
 }
}
