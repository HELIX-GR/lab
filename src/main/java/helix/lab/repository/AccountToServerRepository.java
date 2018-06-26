package helix.lab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import helix.lab.model.user.AccountToServerEntity;

@Repository
@Transactional(readOnly = true)
public interface AccountToServerRepository extends JpaRepository<AccountToServerEntity, Integer> {

}

