package gr.helix.lab.web.domain;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.domain.HubKernelEntity;
import gr.helix.lab.web.model.course.Course;

@Entity(name = "Course")
@Table(
    schema = "lab", name = "course"
)
public class CourseEntity {

    @Id
    @Column(name = "`id`", updatable = false)
    @SequenceGenerator(
        schema = "lab",
        sequenceName = "course_id_seq",
        name = "course_id_seq",
        allocationSize = 1
    )
    @GeneratedValue(generator = "course_id_seq", strategy = GenerationType.SEQUENCE)
    Integer                   id;

    @NotNull
    @ManyToOne(targetEntity = AccountEntity.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "professor", nullable = false)
    AccountEntity             professor;

    @NotNull
    @Column(name = "`title`")
    String                    title;

    @Column(name = "`description`")
    String                    description;

    @NotNull
    @Column(name = "`year`")
    int                       year;

    @NotNull
    @Column(name = "`semester`")
    String                    semester;

    @NotNull
    @Column(name = "`created_on`", insertable = false)
    ZonedDateTime             createdOn = ZonedDateTime.now();

    @NotNull
    @Column(name = "`updated_on`", insertable = false)
    ZonedDateTime             updatedOn = ZonedDateTime.now();

    @NotNull
    @Column(name = "`active`")
    boolean                   active    = false;

    @NotNull
    @Column(name = "`deleted`")
    boolean                   deleted   = false;

    @Column(name = "`link`")
    String                    link;

    @OneToMany(
        targetEntity = CourseStudentEntity.class,
        mappedBy = "course",
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    List<CourseStudentEntity> students = new ArrayList<>();

    @OneToMany(
        targetEntity = CourseFileEntity.class,
        mappedBy = "course",
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    List<CourseFileEntity>    files    = new ArrayList<>();

    @NotNull
    @ManyToOne(targetEntity = HubKernelEntity.class)
    @JoinColumn(name = "hub_kernel", nullable = false)
    HubKernelEntity kernel;

    public AccountEntity getProfessor() {
        return this.professor;
    }

    public void setProfessor(AccountEntity professor) {
        this.professor = professor;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getYear() {
        return this.year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getSemester() {
        return this.semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public ZonedDateTime getCreatedOn() {
        return this.createdOn;
    }

    public void setCreatedOn(ZonedDateTime createdOn) {
        this.createdOn = createdOn;
    }

    public ZonedDateTime getUpdatedOn() {
        return this.updatedOn;
    }

    public void setUpdatedOn(ZonedDateTime updatedOn) {
        this.updatedOn = updatedOn;
    }

    public boolean isActive() {
        return this.active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isDeleted() {
        return this.deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public Integer getId() {
        return this.id;
    }

    public List<CourseStudentEntity> getStudents() {
        return this.students;
    }

    public List<CourseFileEntity> getFiles() {
        return this.files;
    }

    public String getLink() {
        return this.link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public HubKernelEntity getKernel() {
        return this.kernel;
    }

    public void setKernel(HubKernelEntity kernel) {
        this.kernel = kernel;
    }

    public Course toDto() {
        final Course record = new Course();

        record.setActive(this.active);
        record.setCreatedOn(this.createdOn);
        record.setDeleted(this.deleted);
        record.setDescription(this.description);
        record.setId(this.id);
        record.setLink(this.link);
        record.setProfessor(this.professor.getId(), this.professor.getFullName());
        record.setSemester(this.semester);
        record.setTitle(this.title);
        record.setUpdatedOn(this.updatedOn);
        record.setYear(this.year);
        record.setKernel(this.kernel.getName());

        this.students.stream().forEach(s -> record.getStudents().add(s.toDto()));

        this.files.stream().forEach(f -> record.getFiles().add(f.getPath()));

        return record;
    }

    public void merge(Course course) {
        this.active = course.isActive();
        this.description = course.getDescription();
        this.link = course.getLink();
        this.semester = course.getSemester();
        this.title = course.getTitle();
        this.year = course.getYear();
    }

}
