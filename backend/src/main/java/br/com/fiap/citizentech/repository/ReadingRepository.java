package br.com.fiap.citizentech.repository;
import br.com.fiap.citizentech.model.Reading;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface ReadingRepository extends JpaRepository<Reading,Long> {
 Optional<Reading> findTopByOrderByRecordedAtDescIdDesc();
 java.util.List<Reading> findTop30ByOrderByRecordedAtDescIdDesc();
}
