package br.com.fiap.citizentech.repository;
import br.com.fiap.citizentech.model.Fault;
import org.springframework.data.jpa.repository.JpaRepository;
public interface FaultRepository extends JpaRepository<Fault,Long> {
 java.util.List<Fault> findTop30ByOrderByRecordedAtDescIdDesc();
}
