package gr.helix.lab.web.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "helix.saml")
public class SamlConfiguration {

    private List<String> metadata;

    private String       storeFile;

    private String       storePassword;

    private String       client;

    private String       clientPassword;

    private String       defaultProvider;

    private List<String> providers;

    public List<String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(List<String> metadata) {
        this.metadata = metadata;
    }

    public String getStoreFile() {
        return this.storeFile;
    }

    public void setStoreFile(String storeFile) {
        this.storeFile = storeFile;
    }

    public String getStorePassword() {
        return this.storePassword;
    }

    public void setStorePassword(String storePassword) {
        this.storePassword = storePassword;
    }

    public String getClient() {
        return this.client;
    }

    public void setClient(String client) {
        this.client = client;
    }

    public String getClientPassword() {
        return this.clientPassword;
    }

    public void setClientPassword(String clientPassword) {
        this.clientPassword = clientPassword;
    }

    public String getDefaultProvider() {
        return this.defaultProvider;
    }

    public void setDefaultProvider(String defaultProvider) {
        this.defaultProvider = defaultProvider;
    }

    public List<String> getProviders() {
        return this.providers;
    }

    public void setProviders(List<String> providers) {
        this.providers = providers;
    }

}
