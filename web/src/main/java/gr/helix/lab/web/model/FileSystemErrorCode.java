package gr.helix.lab.web.model;

import gr.helix.core.common.model.ErrorCode;

/**
 * Error codes for file system operations
 */
public enum FileSystemErrorCode implements ErrorCode {
    UNKNOWN,
    CANNOT_RESOLVE_PATH,
    PATH_IS_EMPTY,
    PATH_ALREADY_EXISTS,
    PATH_NOT_FOUND,
    PATH_NOT_EMPTY,
    NOT_ENOUGH_SPACE,
    ;

    @Override
    public String key() {
        return (this.getClass().getSimpleName() + '.' + name());
    }

}