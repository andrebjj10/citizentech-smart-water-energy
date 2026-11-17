package br.com.fiap.citizentech;

import br.com.fiap.citizentech.dto.ReadingRequest;
import br.com.fiap.citizentech.model.Fault;
import br.com.fiap.citizentech.repository.FaultRepository;
import br.com.fiap.citizentech.repository.ReadingRepository;
import br.com.fiap.citizentech.service.StationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;

@SpringBootTest(properties = {"spring.datasource.url=jdbc:h2:mem:transaction_test;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop"})
class ReadingTransactionTest {
    @Autowired StationService service;
    @Autowired ReadingRepository readings;
    @MockitoSpyBean FaultRepository faults;

    @Test void rollsBackReadingWhenAlertCannotBeSaved() {
        long before = readings.count();
        doThrow(new IllegalStateException("Falha simulada de persistência"))
                .when(faults).save(any(Fault.class));

        assertThrows(IllegalStateException.class,
                () -> service.createReading(new ReadingRequest(10.0, 40.0, 2000.0, 20.0)));
        assertEquals(before, readings.count(), "Leitura não deve ficar gravada sem seus alertas");
    }
}
