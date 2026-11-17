package br.com.fiap.citizentech;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest(properties={"spring.datasource.url=jdbc:h2:mem:citizentech_test;DB_CLOSE_DELAY=-1","spring.jpa.hibernate.ddl-auto=create-drop"})
@AutoConfigureMockMvc
class StationControllerTest {
 @Autowired MockMvc mvc;
 @Test void health() throws Exception {mvc.perform(get("/api/health")).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("online"));}
 @Test void createReading() throws Exception {mvc.perform(post("/api/readings").contentType(MediaType.APPLICATION_JSON).content("{\"waterLevel\":60,\"flowRate\":10,\"powerWatts\":900,\"energyKwh\":12.5}"))
  .andExpect(status().isCreated()).andExpect(jsonPath("$.waterLevel").value(60));}
 @Test void rejectInvalidReading() throws Exception {mvc.perform(post("/api/readings").contentType(MediaType.APPLICATION_JSON).content("{\"waterLevel\":150,\"flowRate\":10,\"powerWatts\":900,\"energyKwh\":12.5}"))
  .andExpect(status().isBadRequest());}
}
