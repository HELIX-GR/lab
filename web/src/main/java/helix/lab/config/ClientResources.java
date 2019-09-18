package helix.lab.config;

import org.springframework.boot.autoconfigure.security.oauth2.resource.ResourceServerProperties;
import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeResourceDetails;

public class ClientResources {

    private final AuthorizationCodeResourceDetails client   = new AuthorizationCodeResourceDetails();

    private final ResourceServerProperties         resource = new ResourceServerProperties();

    public AuthorizationCodeResourceDetails getClient() {
        return this.client;
    }

    public ResourceServerProperties getResource() {
    	System.out.println(this.resource);
        return this.resource;
    }

}
