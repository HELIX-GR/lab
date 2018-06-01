package helix.lab.controller.action;

import java.security.Principal;
import java.util.AbstractMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.providers.ExpiringUsernameAuthenticationToken;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.model.BasicErrorCode;
import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.model.RestResponse;
import gr.helix.core.common.model.user.Account;
import gr.helix.core.common.service.UserService;
import helix.lab.controller.SsoController;
import helix.lab.model.security.User;

/**
 * Actions for querying and updating user data
 */
@RestController
@Secured({ "ROLE_USER", "ROLE_ADMIN" })
@RequestMapping(produces = "application/json")
public class UserControler {

    private static final Logger logger = LoggerFactory.getLogger(SsoController.class);

    @Autowired
    UserService userService;

    @RequestMapping("/user")
    public Principal user(Principal principal) {
        return principal;
    }

    /**
     * Get profile data for the authenticated user
     *
     * @param authentication the authenticated principal
     * @return user profile data
     */
    @RequestMapping(value = "/action/user/profile", method = RequestMethod.GET)
    public RestResponse<?> getProfile(Authentication authentication) {
        if (authentication instanceof ExpiringUsernameAuthenticationToken) {
            return RestResponse.result(((User) authentication.getDetails()).getAccount());
        }
        if (authentication instanceof UsernamePasswordAuthenticationToken) {
            final String username = authentication.getName();

            final Account account = this.userService.findOneByUsername(username);
            Assert.state(account != null, "Expected to find a user with authenticated username!");

            return RestResponse.result(account);
        }
        if (authentication instanceof OAuth2Authentication) {
            return RestResponse.result(this.accountFromOAuth2Authentication((OAuth2Authentication) authentication));
        }

        logger.warn("User not found " + authentication.getName() );
        return RestResponse.error(BasicErrorCode.USER_NOT_FOUND, "User not found");
    }

    @SuppressWarnings("unchecked")
    private Account accountFromOAuth2Authentication(OAuth2Authentication authentication) {
        final Account account = new Account(authentication.getPrincipal().toString());

        if (authentication.getUserAuthentication().getDetails() instanceof AbstractMap<?, ?>) {
            final AbstractMap<String, String> details = (AbstractMap<String, String>) authentication.getUserAuthentication().getDetails();

            details.keySet().stream()
                .forEach(key -> {
                    switch (key) {
                        case "name":
                            account.setName(details.get(key));
                            break;
                        case "email":
                            account.setEmail(details.get(key));
                            break;
                        case "avatar_url":
                        case "picture":
                            account.setImageUrl(details.get(key));
                            break;
                        case "locale":
                            account.setLang(details.get(key));
                            break;
                    }
                });
        }
        authentication.getAuthorities().stream()
            .map(r -> EnumRole.fromString(r.getAuthority()))
            .filter(r -> r != null)
            .forEach(r -> account.getRoles().add(r));

        return account;
    }

}
