package gr.helix.lab.web.service;

import java.time.ZonedDateTime;
import java.util.AbstractMap;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.autoconfigure.security.oauth2.resource.UserInfoTokenServices;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.common.exceptions.InvalidTokenException;
import org.springframework.security.oauth2.provider.OAuth2Authentication;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.model.user.Account;
import gr.helix.core.common.model.user.AccountProfile;
import gr.helix.core.common.repository.AccountRepository;
import gr.helix.lab.web.config.OAuthUserInfoDetailResolver;
import gr.helix.lab.web.model.security.User;

public class OAuthUserInfoTokenServices extends UserInfoTokenServices {

    private final OAuthUserInfoDetailResolver userInfoDetailResolver;

    private final CustomUserDetailsService    userService;

    private final AccountRepository           accountRepository;

    public OAuthUserInfoTokenServices(
        String userInfoEndpointUrl,
        String clientId,
        CustomUserDetailsService userService,
        OAuthUserInfoDetailResolver userInfoDetailResolver,
        AccountRepository accountRepository
    ) {
        super(userInfoEndpointUrl, clientId);

        this.accountRepository = accountRepository;
        this.userInfoDetailResolver = userInfoDetailResolver;
        this.userService = userService;
    }

    @Override
    @SuppressWarnings("unchecked")
    public OAuth2Authentication loadAuthentication(String accessToken) throws AuthenticationException, InvalidTokenException {
        // Get default authentication
        final OAuth2Authentication authentication = super.loadAuthentication(accessToken);

        // Create custom user details
        final Account account = new Account(authentication.getPrincipal().toString());

        final AbstractMap<String, String> details = (AbstractMap<String, String>) authentication.getUserAuthentication().getDetails();

        details.keySet().stream().forEach(key -> {
            final String property = this.userInfoDetailResolver.resolve(key);

            if(!StringUtils.isBlank(property)) {
                switch (property) {
                    case OAuthUserInfoDetailResolver.NAME_PROPERTY:
                        account.setName(details.get(key));
                        break;
                    case OAuthUserInfoDetailResolver.EMAIL_PROPERTY:
                        account.setEmail(details.get(key));
                        break;
                    case OAuthUserInfoDetailResolver.IMAGE_PROPERTY:
                        account.setImageUrl(details.get(key));
                        break;
                    case OAuthUserInfoDetailResolver.LOCALE_PROPERTY:
                        account.setLang(details.get(key));
                        break;
                }
            }
        });

        // An email is required
        if (StringUtils.isBlank(account.getEmail())) {
            throw new UsernameNotFoundException("A valid email address is required.");
        }

        UserDetails user;
        try {
            user = this.userService.loadUserByUsername(account.getEmail());
        } catch (final UsernameNotFoundException ex) {
            // Create user
            final AccountEntity newAccount = new AccountEntity(account.getEmail(), account.getEmail());

            newAccount.setRegistered(ZonedDateTime.now());
            newAccount.grant(EnumRole.ROLE_USER, null);

            user = this.userService.createUser(newAccount);
        }

        // Get profile from database
        final Optional<AccountProfile> profile = this.accountRepository.getProfileByEmail(account.getEmail());
        if (profile.isPresent()) {
            ((User) user).getAccount().setProfile(profile.get());
        }

        // Replace authentication
        final UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(user, "N/A", user.getAuthorities());
        token.setDetails(user);

        return new OAuth2Authentication(authentication.getOAuth2Request(), token);
    }

}
