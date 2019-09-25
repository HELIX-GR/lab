package gr.helix.lab.web.service;

import java.util.Locale;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import gr.helix.core.common.model.EnumRole;
import gr.helix.lab.web.model.security.User;


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
    public User getCurrentUser() {
        final Authentication authentication = this.getAuthentication();
        if (authentication == null) {
            return null;
        }
        return (User) authentication.getPrincipal();
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
    public String getCurrentUserEmail() {
        final Authentication authentication = this.getAuthentication();
        if (authentication == null) {
            return null;
        }
        return ((User) authentication.getPrincipal()).getEmail();
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

    @Override
    public EnumRole[] getRoles() {
        final Authentication authentication = this.getAuthentication();
        if (authentication == null) {
            return new EnumRole[] {};
        }
        return ((User) authentication.getPrincipal()).getAuthorities().stream()
            .map(a -> EnumRole.fromString(a.getAuthority()))
            .toArray(EnumRole[]::new);
    }


    @Override
    public boolean hasRole(EnumRole role) {
        final Authentication authentication = this.getAuthentication();
        if (authentication == null) {
            return false;
        }
        return ((User) authentication.getPrincipal()).hasRole(role);
    }

}