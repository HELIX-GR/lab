package helix.lab.service;

import java.util.Locale;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import helix.lab.model.security.User;


@Component
public class AuthenticationFacade implements IAuthenticationFacade {

    @Override
    public Authentication getAuthentication() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof AnonymousAuthenticationToken) {
            return null;
        }
        return authentication;
    }

    @Override
    public Integer getCurrentUserId() {
        final Authentication authentication = this.getAuthentication();
        if (authentication == null) {
            return null;
        }
        return ((User) authentication.getPrincipal()).getId();
    }

    @Override
    public String getCurrentUserName() {
        final Authentication authentication = this.getAuthentication();
        if (authentication == null) {
            return null;
        }
        return ((User) authentication.getPrincipal()).getUsername();
    }

    @Override
    public Locale getCurrentUserLocale() {
        final Authentication authentication = this.getAuthentication();
        if (authentication == null) {
            return null;
        }
        final String lang = ((User) authentication.getPrincipal()).getLang();

        return Locale.forLanguageTag(lang);
    }

}