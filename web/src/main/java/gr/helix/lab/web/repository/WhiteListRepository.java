package gr.helix.lab.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import gr.helix.lab.web.domain.WhiteListEntryEntity;

@Repository
@Transactional(readOnly = true)
public interface WhiteListRepository extends JpaRepository<WhiteListEntryEntity, Integer> {

    @Query("FROM WhiteListEntry a WHERE a.username = :username")
    WhiteListEntryEntity findOneByUsername(@Param("username") String username);

    @Query("FROM WhiteListEntry a WHERE a.email = :email")
    WhiteListEntryEntity findOneByEmail(@Param("email") String email);

}
