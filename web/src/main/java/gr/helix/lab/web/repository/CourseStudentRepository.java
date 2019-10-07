package gr.helix.lab.web.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import gr.helix.lab.web.domain.CourseStudentEntity;

@Repository
@Transactional(readOnly = true)
public interface CourseStudentRepository extends JpaRepository<CourseStudentEntity, Integer> {

    @Query("FROM CourseStudent c WHERE c.course.id = :id and c.course.active = true order by c.createdOn desc")
    public List<CourseStudentEntity> findAllByCourseId(@Param("id") int id);

    @Query("FROM CourseStudent c WHERE c.whiteListEntry.email = :email and c.course.id = :courseId")
    public Optional<CourseStudentEntity> findByStudentEmailAndCourseId(@Param("email") String email, @Param("courseId") int courseId);

}
