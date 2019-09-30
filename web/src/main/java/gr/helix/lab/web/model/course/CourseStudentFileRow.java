package gr.helix.lab.web.model.course;

import javax.validation.constraints.Email;

public class CourseStudentFileRow {

    private int    index;

    @Email()
    private String email;

    private String firstName;

    private String lastName;

    public CourseStudentFileRow(int index, String email, String firstName, String lastName) {
        this.index = index;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public int getIndex() {
        return this.index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return this.lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

}
