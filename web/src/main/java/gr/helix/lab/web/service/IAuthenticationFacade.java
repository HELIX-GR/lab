package gr.helix.lab.web.service;
import java.util.Locale;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import gr.helix.lab.web.model.security.User;


public interface IAuthenticationFacade {

    /**
     * Get the current {@link Authentication} object from the {@link SecurityContextHolder}
     * @return
     */
    Authentication getAuthentication();

    /**
     * Get the user
     *
     * @return the user or {@code null} if the user is not authenticated
     */
    User getCurrentUser();

    /**
     * Get the unique id of the authenticated user
     *
     * @return the user unique id or {@code null} if the user is not authenticated
     */
    Integer getCurrentUserId();

    /**
     * Get the user name
     *
     * @return the user name or {@code null} if the user is not authenticated
     */
    String getCurrentUserName();

    /**
     * Get the user locale
     *
     * @return the user locale or {@code null} if the user is not authenticated
     */
    Locale getCurrentUserLocale();

}