package gr.helix.lab.web.model.course;

import java.time.ZonedDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import gr.helix.core.common.model.admin.WhiteListEntry;

public class CourseStudent {

    private int            id;

    @JsonIgnoreProperties("roles")
    private WhiteListEntry student;

    private ZonedDateTime  createdOn;

    private ZonedDateTime  lastFileCopyOn;

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public WhiteListEntry getStudent() {
        return this.student;
    }

    public void setStudent(WhiteListEntry student) {
        this.student = student;
    }

    public ZonedDateTime getCreatedOn() {
        return this.createdOn;
    }

    public void setCreatedOn(ZonedDateTime createdOn) {
        this.createdOn = createdOn;
    }

    public ZonedDateTime getLastFileCopyOn() {
        return this.lastFileCopyOn;
    }

    public void setLastFileCopyOn(ZonedDateTime lastFileCopyOn) {
        this.lastFileCopyOn = lastFileCopyOn;
    }

}
