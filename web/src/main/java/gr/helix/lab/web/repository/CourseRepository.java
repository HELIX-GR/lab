package gr.helix.lab.web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import gr.helix.lab.web.domain.CourseEntity;

@Repository
@Transactional(readOnly = true)
public interface CourseRepository extends JpaRepository<CourseEntity, Integer> {

    @Query("FROM Course c WHERE c.professor.id = :id and c.deleted = false order by updatedOn desc")
    public List<CourseEntity> findByProfessorId(@Param("id") int id);

    @Query("FROM Course c WHERE c.professor.id = :id and c.deleted = false and c.year = :year order by updatedOn desc")
    public List<CourseEntity> findByProfessorIdAndYear(@Param("id") int id, @Param("year") int year);

    @Query(
        "select c.course FROM CourseStudent c WHERE c.whiteListEntry.email = :email and c.course.deleted = false order by c.course.createdOn desc"
    )
    public List<CourseEntity> findByStudentEmail(@Param("email") String email);

}
