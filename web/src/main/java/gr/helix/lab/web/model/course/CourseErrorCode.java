package gr.helix.lab.web.model.course;

import gr.helix.core.common.model.ErrorCode;

/**
 * Error codes for course operations
 */
public enum CourseErrorCode implements ErrorCode {
    UNKNOWN,

    COURSE_NOT_FOUND,

    REGISTRATION_NOT_FOUND,
    REGISTRATION_ALREADY_EXISTS,

    RELATIVE_PATH_REQUIRED,
    PATH_EXISTS,
    PATH_NOT_EMPTY,
    PATH_NOT_FOUND,
    PATH_TARGET_EQUAL_TO_SOURCE,
    IO_ERROR,

    IMPORT_ERROR,
    IMPORT_FIELD_MISSING,
    IMPORT_FIELD_INVALID,
    ;

    @Override
    public String key() {
        return (this.getClass().getSimpleName() + '.' + this.name());
    }

}