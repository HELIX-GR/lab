package gr.helix.lab.web.repository;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import gr.helix.lab.web.domain.AccountServerEntity;

@Repository
@Transactional(readOnly = true)
public interface AccountServerRepository extends JpaRepository<AccountServerEntity, Integer> {

    @Query(value = "SELECT * FROM lab.account_to_server a WHERE a.account = :userid", nativeQuery = true)
    public List<AccountServerEntity> findAllServersByUserId(@Param("userid") int userid);

    @Query(value = "SELECT * FROM lab.account_to_server a  WHERE a.server_id = :server_id", nativeQuery = true)
    public List<AccountServerEntity> findAllByServerId(@Param("server_id") String server_id);

    @Query(value = "SELECT * FROM lab.account_to_server a WHERE a.started_at > :start", nativeQuery = true)
    public List<AccountServerEntity> findByRegisteredAfter(@Param("start") ZonedDateTime start);

}
