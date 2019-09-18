package gr.helix.lab.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import gr.helix.core.common.domain.AccountRoleEntity;

@Repository
@Transactional(readOnly = true)
public interface AccountRoleRepository extends JpaRepository<AccountRoleEntity, Integer> {

  

}