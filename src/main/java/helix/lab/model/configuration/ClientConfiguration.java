package helix.lab.model.configuration;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Application configuration settings
 */
public class ClientConfiguration {

    @JsonIgnore
    private final List<String>    identityProviders = new ArrayList<String>();

    private String                defaultIdentityProvider;

    
    public List<String> getIdentityProviders() {
        return this.identityProviders;
    }

    public String getDefaultIdentityProvider() {
        return this.defaultIdentityProvider;
    }

    public void setDefaultIdentityProvider(String defaultIdentityProvider) {
        this.defaultIdentityProvider = defaultIdentityProvider;
    }

    public void addIdentityProvider(String identityProvider) {
        this.identityProviders.add(identityProvider);
    }
}
