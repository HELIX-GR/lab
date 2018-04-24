package helix.lab.service;

import java.util.Locale;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class DefaultAuthenticationFacade implements AuthenticationFacade
{

    @Override
    public Authentication getAuthentication()
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof AnonymousAuthenticationToken) {
            return null;
        }
        return authentication;
    }

    @Override
    public Integer getCurrentUserId()
    {
        Authentication authentication = this.getAuthentication();
        if (authentication == null) {
            return null;
        }
        
        // Todo return ((Details) authentication.getPrincipal()).getId();
        throw new UnsupportedOperationException("No user ID for current authentication mechanism");
    }

    @Override
    public String getCurrentUserName()
    {
        Authentication authentication = this.getAuthentication();
        if (authentication == null) {
            return null;
        }
        return authentication.getName();
    }

    @Override
    public Locale getCurrentUserLocale()
    {
        Authentication authentication = this.getAuthentication();
        if (authentication == null) {
            return null;
        }
        
        // Todo String lang = ((Details) authentication.getPrincipal()).getLang();
        String lang = "en"; 
        
        return Locale.forLanguageTag(lang);
    }

}
