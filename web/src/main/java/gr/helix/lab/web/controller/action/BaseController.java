package gr.helix.lab.web.controller.action;

import org.springframework.beans.factory.annotation.Autowired;

import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.model.security.User;
import gr.helix.lab.web.service.FileNamingStrategy;
import gr.helix.lab.web.service.IAuthenticationFacade;

public abstract class BaseController {

    @Autowired
    private IAuthenticationFacade authenticationFacade;

    @Autowired
    protected FileNamingStrategy  fileNamingStrategy;

    protected User currentUser() {
        return this.authenticationFacade.getCurrentUser();
    }

    protected int currentUserId() {
        return this.authenticationFacade.getCurrentUserId();
    }

    protected String currentUserName() {
        return this.authenticationFacade.getCurrentUserEmail();
    }

    protected boolean hasRole(EnumRole role) {
        return this.authenticationFacade.hasRole(role);
    }

    protected EnumRole[] getRoles() {
        return this.authenticationFacade.getRoles();
    }

}
