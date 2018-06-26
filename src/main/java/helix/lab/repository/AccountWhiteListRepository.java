package helix.lab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import helix.lab.domain.AccountWhiteListEntry;

@Repository
@Transactional(readOnly = true)
public interface AccountWhiteListRepository extends JpaRepository<AccountWhiteListEntry, Integer> {

    @Query("FROM Account a WHERE a.username = :username")
    AccountWhiteListEntry findOneByUsername(@Param("username") String username);

    @Query("FROM Account a WHERE a.email = :email")
    AccountWhiteListEntry findOneByEmail(@Param("email") String email);

    //@Query("FROM Account a WHERE a.registeredAt > :start")
    //List<AccountEntity> findByRegisteredAfter(@Param("start") ZonedDateTime start);


}
