package gr.helix.lab.web.domain;

import java.time.ZonedDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

@Entity(name = "CourseFile")
@Table(
    schema = "lab", name = "`course_file`",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_pk_course_path", columnNames = {"`course`", "`path`"})
    }
)
public class CourseFileEntity {

    @Id
    @Column(name = "`id`", updatable = false)
    @SequenceGenerator(
        schema = "lab",
        sequenceName = "course_file_id_seq",
        name = "course_file_id_seq",
        allocationSize = 1
    )
    @GeneratedValue(generator = "course_file_id_seq", strategy = GenerationType.SEQUENCE)
    Integer       id;

    @NotNull
    @ManyToOne(targetEntity = CourseEntity.class)
    @JoinColumn(name = "course", nullable = false)
    CourseEntity  course;

    @NotNull
    @Column(name = "path")
    String        path;

    @NotNull
    @Column(name = "created_on", insertable = false)
    ZonedDateTime createdOn = ZonedDateTime.now();

    public CourseEntity getCourse() {
        return this.course;
    }

    public void setCourse(CourseEntity course) {
        this.course = course;
    }

    public String getPath() {
        return this.path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public ZonedDateTime getCreatedOn() {
        return this.createdOn;
    }

    public void setCreatedOn(ZonedDateTime createdOn) {
        this.createdOn = createdOn;
    }

    public int getId() {
        return this.id;
    }

  }
