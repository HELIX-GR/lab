package gr.helix.lab.web.controller.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.model.RestResponse;
import gr.helix.core.common.model.user.Account;
import gr.helix.lab.web.service.AuthenticationFacade;

/**
 * Actions for querying and updating user data
 */
@RestController
@Secured({ "ROLE_USER", "ROLE_ADMIN" })
@RequestMapping(produces = "application/json")
public class ProfileController {

    @Autowired
    AuthenticationFacade        authenticationFacade;

    /**
     * Get profile data for the authenticated user
     *
     * @param authentication the authenticated principal
     * @return user profile data
     */
    @RequestMapping(value = "/action/user/profile", method = RequestMethod.GET)
    public RestResponse<?> getProfile(Authentication authentication) {
    	
    	System.out.println("CurrentUser: "+this.authenticationFacade.getCurrentUser());
        final Account account = this.authenticationFacade.getCurrentUser().getAccount();
        return RestResponse.result(account);
    }

}