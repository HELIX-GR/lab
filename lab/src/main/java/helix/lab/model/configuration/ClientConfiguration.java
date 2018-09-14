package helix.lab.model.configuration;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import helix.lab.model.ckan.CkanMetadata;

/**
 * Application configuration settings
 */
public class ClientConfiguration {

    @JsonIgnore
    private final List<String> identityProviders = new ArrayList<String>();

    private String defaultIdentityProvider;
    
    private CkanMetadata ckan;

    
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
    
    public CkanMetadata getCkan() {
        return this.ckan;
    }

    public void setCkan(CkanMetadata ckan) {
        this.ckan = ckan;
    }

}
