package gr.helix.lab.web.model.course;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import gr.helix.core.common.model.user.AccountInfo;

public class Course {

    @JsonIgnore()
    private Integer                   id;

    @JsonIgnore()
    private AccountInfo               professor;

    private String                    title;

    private String                    description;

    private int                       year;

    private String                    semester;

    @JsonIgnore()
    private ZonedDateTime             createdOn;

    @JsonIgnore()
    private ZonedDateTime             updatedOn;

    @JsonIgnore()
    private final List<CourseStudent> students = new ArrayList<CourseStudent>();

    private final List<String>        files    = new ArrayList<String>();

    private boolean                   active;

    @JsonIgnore()
    private boolean                   deleted;

    private String                    link;

    @JsonProperty()
    public Integer getId() {
        return this.id;
    }

    @JsonIgnore()
    public void setId(Integer id) {
        this.id = id;
    }

    @JsonProperty()
    public AccountInfo getProfessor() {
        return this.professor;
    }

    @JsonIgnore()
    public void setProfessor(AccountInfo professor) {
        this.professor = professor;
    }

    @JsonIgnore()
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

    @JsonProperty()
    public ZonedDateTime getCreatedOn() {
        return this.createdOn;
    }

    @JsonIgnore()
    public void setCreatedOn(ZonedDateTime createdOn) {
        this.createdOn = createdOn;
    }

    @JsonProperty()
    public ZonedDateTime getUpdatedOn() {
        return this.updatedOn;
    }

    @JsonIgnore()
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

    @JsonProperty()
    public boolean isDeleted() {
        return this.deleted;
    }

    @JsonIgnore()
    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public String getLink() {
        return this.link;
    }

    public void setLink(String link) {
        this.link = link;
    }

}
