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

import gr.helix.lab.web.model.course.CourseStudent;

@Entity(name = "CourseStudent")
@Table(
    schema = "lab", name = "`course_student`",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_pk_course_white_list", columnNames = {"`course`", "`white_list`"})
    }
)
public class CourseStudentEntity {

    @Id
    @Column(name = "`id`", updatable = false)
    @SequenceGenerator(
        schema = "lab",
        sequenceName = "course_student_id_seq",
        name = "course_student_id_seq",
        allocationSize = 1
    )
    @GeneratedValue(generator = "course_student_id_seq", strategy = GenerationType.SEQUENCE)
    Integer              id;

    @NotNull
    @ManyToOne(targetEntity = CourseEntity.class)
    @JoinColumn(name = "course", nullable = false)
    CourseEntity         course;

    @NotNull
    @ManyToOne(targetEntity = WhiteListEntryEntity.class)
    @JoinColumn(name = "white_list", nullable = false)
    WhiteListEntryEntity whiteListEntry;

    @NotNull
    @Column(name = "created_on", insertable = false)
    ZonedDateTime        createdOn = ZonedDateTime.now();

    @Column(name = "last_file_copy_on")
    ZonedDateTime        lastFileCopyOn;

    public CourseEntity getCourse() {
        return this.course;
    }

    public void setCourse(CourseEntity course) {
        this.course = course;
    }

    public WhiteListEntryEntity getWhiteListEntry() {
        return this.whiteListEntry;
    }

    public void setWhiteListEntry(WhiteListEntryEntity registration) {
        this.whiteListEntry = registration;
    }

    public ZonedDateTime getCreatedOn() {
        return this.createdOn;
    }

    public void setCreatedOn(ZonedDateTime createdOn) {
        this.createdOn = createdOn;
    }

    public Integer getId() {
        return this.id;
    }

    public ZonedDateTime getLastFileCopyOn() {
        return this.lastFileCopyOn;
    }

    public void setLastFileCopyOn(ZonedDateTime lastFileCopyOn) {
        this.lastFileCopyOn = lastFileCopyOn;
    }

    public CourseStudent toDto() {
        final CourseStudent record = new CourseStudent();

        record.setCreatedOn(this.createdOn);
        record.setId(this.id);
        record.setStudent(this.whiteListEntry.toDto());
        record.setLastFileCopyOn(this.lastFileCopyOn);

        return record;
    }

  }
