package br.com.fiap.citizentech;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import br.com.fiap.citizentech.repository.*;
import br.com.fiap.citizentech.model.Reading;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest(properties={"spring.datasource.url=jdbc:h2:mem:citizentech_test;DB_CLOSE_DELAY=-1","spring.jpa.hibernate.ddl-auto=create-drop"})
@AutoConfigureMockMvc
@Transactional
class StationControllerTest {
 @Autowired MockMvc mvc;
 @Autowired ReadingRepository readings;
 @Autowired FaultRepository faults;
 @Autowired ActuatorRepository actuators;
 @Test void health() throws Exception {mvc.perform(get("/api/health")).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("online"));}
 @Test void createReading() throws Exception {mvc.perform(post("/api/readings").contentType(MediaType.APPLICATION_JSON).content("{\"waterLevel\":60,\"flowRate\":10,\"powerWatts\":900,\"energyKwh\":12.5}"))
  .andExpect(status().isCreated()).andExpect(jsonPath("$.waterLevel").value(60));}
 @Test void rejectInvalidReading() throws Exception {mvc.perform(post("/api/readings").contentType(MediaType.APPLICATION_JSON).content("{\"waterLevel\":150,\"flowRate\":10,\"powerWatts\":900,\"energyKwh\":12.5}"))
  .andExpect(status().isBadRequest());}

 @ParameterizedTest
 @CsvSource({"14.9,35,1800,1", "15,35,1800,0", "15,35.1,1800,1", "15,35,1800.1,1", "10,40,2000,3"})
 void generatesAlertsAtExpectedLimits(double level, double flow, double power, int expected) throws Exception {
  long before = faults.count();
  String body = "{\"waterLevel\":" + level + ",\"flowRate\":" + flow + ",\"powerWatts\":" + power + ",\"energyKwh\":12.5}";
  mvc.perform(post("/api/readings").contentType(MediaType.APPLICATION_JSON).content(body))
    .andExpect(status().isCreated());
  assertEquals(before + expected, faults.count());
  if (level < 15) assertTrue(faults.findAll().stream().anyMatch(f -> f.getSeverity().equals("CRITICAL")));
 }

 @Test void rejectsMissingReadingFieldsWithoutSaving() throws Exception {
  long before = readings.count();
  mvc.perform(post("/api/readings").contentType(MediaType.APPLICATION_JSON).content("{}"))
    .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors.waterLevel").exists());
  assertEquals(before, readings.count());
 }

 @Test void rejectsNegativeFlow() throws Exception {
  mvc.perform(post("/api/readings").contentType(MediaType.APPLICATION_JSON)
    .content("{\"waterLevel\":20,\"flowRate\":-1,\"powerWatts\":0,\"energyKwh\":0}"))
    .andExpect(status().isBadRequest());
 }

 @Test void latestAndHistoryReturnNewestReading() throws Exception {
  Reading saved = readings.save(new Reading(66.6, 12, 900, 21));
  mvc.perform(get("/api/readings/latest")).andExpect(status().isOk())
    .andExpect(jsonPath("$.id").value(saved.getId()));
  mvc.perform(get("/api/readings")).andExpect(status().isOk())
    .andExpect(jsonPath("$[0].id").value(saved.getId()));
 }

 @Test void returnsNotFoundWhenNoReadingExists() throws Exception {
  readings.deleteAll();
  mvc.perform(get("/api/readings/latest")).andExpect(status().isNotFound())
    .andExpect(jsonPath("$.detail").value("Sem leituras"));
 }

 @Test void changesActuatorState() throws Exception {
  var actuator = actuators.findAll().getFirst();
  boolean expected = !actuator.isEnabled();
  mvc.perform(put("/api/actuators/" + actuator.getId()).contentType(MediaType.APPLICATION_JSON)
    .content("{\"enabled\":" + expected + "}"))
    .andExpect(status().isOk()).andExpect(jsonPath("$.enabled").value(expected));
  assertEquals(expected, actuators.findById(actuator.getId()).orElseThrow().isEnabled());
  mvc.perform(get("/api/actuators")).andExpect(status().isOk());
 }

 @Test void rejectsMissingActuatorState() throws Exception {
  long id = actuators.findAll().getFirst().getId();
  mvc.perform(put("/api/actuators/" + id).contentType(MediaType.APPLICATION_JSON).content("{}"))
    .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors.enabled").exists());
 }

 @Test void returnsNotFoundForUnknownActuator() throws Exception {
  mvc.perform(put("/api/actuators/999999").contentType(MediaType.APPLICATION_JSON).content("{\"enabled\":true}"))
    .andExpect(status().isNotFound());
 }

 @Test void acceptsAndNormalizesFaultSeverity() throws Exception {
  mvc.perform(post("/api/faults").contentType(MediaType.APPLICATION_JSON)
    .content("{\"message\":\"Sensor desconectado\",\"severity\":\"warning\"}"))
    .andExpect(status().isCreated()).andExpect(jsonPath("$.severity").value("WARNING"));
  mvc.perform(get("/api/faults")).andExpect(status().isOk())
    .andExpect(jsonPath("$[0].message").value("Sensor desconectado"));
 }

 @Test void rejectsUnknownSeverity() throws Exception {
  mvc.perform(post("/api/faults").contentType(MediaType.APPLICATION_JSON)
    .content("{\"message\":\"Teste\",\"severity\":\"INVALID\"}"))
    .andExpect(status().isBadRequest());
 }

 @Test void rejectsOversizedFaultMessage() throws Exception {
  mvc.perform(post("/api/faults").contentType(MediaType.APPLICATION_JSON)
    .content("{\"message\":\"" + "x".repeat(256) + "\",\"severity\":\"INFO\"}"))
    .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors.message").exists());
 }

 @Test void rejectsMalformedJson() throws Exception {
  mvc.perform(post("/api/readings").contentType(MediaType.APPLICATION_JSON).content("{"))
    .andExpect(status().isBadRequest()).andExpect(jsonPath("$.detail").exists());
 }
}
