package helix.lab.repository;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import helix.lab.model.user.AccountToServerEntity;

@Repository
@Transactional(readOnly = true)
public interface AccountToServerRepository extends JpaRepository<AccountToServerEntity, Integer> {

	
	@Query(value = "SELECT * FROM Helix_lab.account_to_server a WHERE a.account = :userid", nativeQuery = true)
    public List<AccountToServerEntity> findAllServersByUserId(@Param("userid") String userid);
	 
	@Query(value = "SELECT * FROM Helix_lab.account_to_server a  WHERE a.server_id = :server_id", nativeQuery = true)
	public List<AccountToServerEntity>  findAllByServerId(@Param("server_id") String server_id);
	    
	@Query(value = "SELECT * FROM Helix_lab.account_to_server a WHERE a.started_at > :start", nativeQuery = true)
	public List<AccountToServerEntity> findByRegisteredAfter(@Param("start") ZonedDateTime start);

}

