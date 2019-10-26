package gr.helix.lab.web.controller.action;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.model.RestResponse;
import gr.helix.core.common.model.user.Account;
import gr.helix.core.common.model.user.AccountProfile;
import gr.helix.core.common.model.user.Favorite;
import gr.helix.core.common.model.user.FavoriteCollection;
import gr.helix.core.common.model.user.Profile;
import gr.helix.core.common.repository.AccountRepository;
import gr.helix.core.common.repository.IFavoriteRepository;
import gr.helix.core.common.service.AuthenticationFacade;

/**
 * Actions for querying and updating user data
 */
@RestController
@Secured({"ROLE_USER"})
@RequestMapping(produces = "application/json")
public class ProfileController {

    @Autowired
    private AuthenticationFacade authenticationFacade;

    @Autowired
    private IFavoriteRepository  favoriteRepository;

    @Autowired
    private AccountRepository    accountRepository;

    /**
     * Get profile data for the authenticated user
     *
     * @param authentication the authenticated principal
     * @return user profile data
     */
    @GetMapping(value = "/action/user/profile")
    public RestResponse<?> getProfile(Authentication authentication) {
        final Account account = this.authenticationFacade.getCurrentUser().getAccount();

        // Refresh profile for each request since the account object stored in the
        // security context may have stale data
        final Optional<AccountProfile> profile = this.accountRepository.getProfileByEmail(account.getEmail());
        account.setProfile(profile.isPresent() ? profile.get() : new AccountProfile());

        final List<FavoriteCollection> collections = this.favoriteRepository.getCollectionsByEmail(account.getEmail());
        final List<Favorite> favorites = this.favoriteRepository.getFavoritesByEmail(account.getEmail());

        final Profile result = new Profile();

        result.setAccount(account);
        result.setCollections(collections);
        result.setFavorites(favorites);

        return RestResponse.result(result);
    }

}