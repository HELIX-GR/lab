package gr.helix.lab.web.repository;

import java.util.ArrayList;
import java.util.List;

import gr.helix.core.common.model.Error;
import gr.helix.lab.web.model.course.CourseErrorCode;

public class CourseStudentImportResult {

    private int               count  = 0;

    private final List<Error> errors = new ArrayList<Error>();

    public int getCount() {
        return this.count;
    }

    public List<Error> getErrors() {
        return this.errors;
    }

    public void add() {
        this.count += 1;
    }

    public void add(CourseErrorCode code, String message) {
        this.errors.add(new Error(code, message));
    }
}
