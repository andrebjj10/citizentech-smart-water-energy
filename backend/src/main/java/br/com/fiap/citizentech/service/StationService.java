package br.com.fiap.citizentech.service;

import br.com.fiap.citizentech.dto.*;
import br.com.fiap.citizentech.model.*;
import br.com.fiap.citizentech.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class StationService {
    private final ReadingRepository readings;
    private final ActuatorRepository actuators;
    private final FaultRepository faults;

    public StationService(ReadingRepository readings, ActuatorRepository actuators, FaultRepository faults) {
        this.readings = readings;
        this.actuators = actuators;
        this.faults = faults;
    }

    public List<Reading> readings() {
        return readings.findTop30ByOrderByRecordedAtDescIdDesc();
    }

    public Reading latest() {
        return readings.findTopByOrderByRecordedAtDescIdDesc()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sem leituras"));
    }

    @Transactional
    public Reading createReading(ReadingRequest request) {
        if (!Double.isFinite(request.waterLevel()) || !Double.isFinite(request.flowRate())
                || !Double.isFinite(request.powerWatts()) || !Double.isFinite(request.energyKwh())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valores devem ser finitos");
        }
        Reading saved = readings.save(new Reading(request.waterLevel(), request.flowRate(),
                request.powerWatts(), request.energyKwh()));
        // A leitura e todos os seus alertas são confirmados na mesma transação.
        if (request.waterLevel() < 15) {
            faults.save(new Fault("Nível de água crítico: " + request.waterLevel() + "%", "CRITICAL"));
        }
        if (request.flowRate() > 35) {
            faults.save(new Fault("Vazão acima do limite: " + request.flowRate() + " L/min", "WARNING"));
        }
        if (request.powerWatts() > 1800) {
            faults.save(new Fault("Consumo elétrico elevado: " + request.powerWatts() + " W", "WARNING"));
        }
        return saved;
    }

    public List<Actuator> actuators() {
        return actuators.findAll();
    }

    @Transactional
    public Actuator updateActuator(Long id, ActuatorRequest request) {
        Actuator actuator = actuators.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Atuador não encontrado"));
        actuator.setEnabled(request.enabled());
        return actuators.save(actuator);
    }

    public List<Fault> faults() {
        return faults.findTop30ByOrderByRecordedAtDescIdDesc();
    }

    @Transactional
    public Fault createFault(FaultRequest request) {
        String severity = request.severity().toUpperCase(Locale.ROOT);
        if (!Set.of("INFO", "WARNING", "CRITICAL").contains(severity)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Severidade inválida: INFO, WARNING ou CRITICAL");
        }
        return faults.save(new Fault(request.message().trim(), severity));
    }
}
