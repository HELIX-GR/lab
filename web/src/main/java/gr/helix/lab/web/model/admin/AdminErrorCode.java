package gr.helix.lab.web.model.admin;

import gr.helix.core.common.model.ErrorCode;

public enum AdminErrorCode implements ErrorCode {
    UNKNOWN,

    ACCOUNT_NOT_FOUND,

    WHITE_LIST_ENTRY_EXISTS,
    WHITE_LIST_ENTRY_NOT_FOUND,

    HUB_SERVER_NOT_FOUND,
    HUB_SERVER_CONNECTION_FAILED,
    HUB_SERVER_PARSE_ERROR,
    HUB_SERVER_ACCESS_DENIED,

    HUB_KERNEL_NOT_FOUND,
    HUB_KERNEL_NOT_SUPPORTED,
    HUB_KERNEL_ACCESS_DENIED,

    HUB_USER_INIT_FAILED,

    REGISRATION_NOT_FOUND,

    NOTEBOOK_SERVER_INIT_FAILURE,
    ;

    @Override
    public String key() {
        return (this.getClass().getSimpleName() + '.' + this.name());
    }

}
