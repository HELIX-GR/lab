package gr.helix.lab.web.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import gr.helix.core.common.domain.HubKernelEntity;

@Repository
@Transactional(readOnly = true)
public interface HubKernelRepository extends JpaRepository<HubKernelEntity, Integer> {

    @Override
    @Query("FROM HubKernel k order by k.index, k.tag")
    public List<HubKernelEntity> findAll();

    @Query("FROM HubKernel k WHERE k.name = :name")
    public Optional<HubKernelEntity> findByName(@Param("name") String name);

}
