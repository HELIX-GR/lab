package gr.helix.lab.web.model.course;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import gr.helix.core.common.model.user.AccountInfo;

public class Course {

    private Integer                   id;

    private AccountInfo               professor;

    private String                    title;

    private String                    description;

    private int                       year;

    private String                    semester;

    private ZonedDateTime             createdOn;

    private ZonedDateTime             updatedOn;

    private final List<CourseStudent> students = new ArrayList<CourseStudent>();

    private final List<String>        files    = new ArrayList<String>();

    private boolean                   active;

    private boolean                   deleted;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public AccountInfo getProfessor() {
        return this.professor;
    }

    public void setProfessor(int id, String name) {
        this.professor = new AccountInfo(id, name);
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

    public List<CourseStudent> getStudents() {
        return this.students;
    }

    public List<String> getFiles() {
        return this.files;
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

}
