package helix.lab.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import helix.lab.model.user.HubServerEntity;

@Repository
@Transactional(readOnly = true)
public interface HubServerRepository extends JpaRepository<HubServerEntity, Integer> {

	@Query(value = "SELECT * FROM Helix_lab.hub_server a WHERE a.role_eligible = :role_eligible AND available= true", nativeQuery = true)
    public List<HubServerEntity> findAllByRole(@Param("role_eligible") String role_eligible);
}
