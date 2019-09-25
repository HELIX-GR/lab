package gr.helix.lab.web.model;

import gr.helix.core.common.model.ErrorCode;

/**
 * Error codes for Jupyter notebooks operations
 */
public enum NotebookErrorCode implements ErrorCode {
    UNKNOWN,

    NOTEBOOK_ID_MISSING,
    ;

    @Override
    public String key() {
        return (this.getClass().getSimpleName() + '.' + this.name());
    }

}