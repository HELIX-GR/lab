package gr.helix.lab.web.controller.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.model.RestResponse;
import gr.helix.core.common.model.user.Account;
import gr.helix.lab.web.service.AuthenticationFacade;

/**
 * Actions for querying and updating user data
 */
@RestController
@Secured({"ROLE_USER"})
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
    @GetMapping(value = "/action/user/profile")
    public RestResponse<?> getProfile(Authentication authentication) {
        final Account account = this.authenticationFacade.getCurrentUser().getAccount();

        return RestResponse.result(account);
    }

}