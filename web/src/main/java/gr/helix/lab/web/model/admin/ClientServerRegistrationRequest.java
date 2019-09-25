package gr.helix.lab.web.model.admin;

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import gr.helix.core.common.model.EnumRole;

public class ClientServerRegistrationRequest {

    public interface ServerSimpleValidation {

    }

    @Size(min = 4, max = 30)
    @NotEmpty
    private String       name;

    @NotEmpty
    private String       description;

    @NotEmpty
    private String       url;

    @NotNull
    private Boolean      available;

    @NotEmpty
    private String       token;

    @NotNull
    private EnumRole     eligibleRole;

    private long         memory;

    private int          virtualCores;

    private List<String> tags;

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getAvailable() {
        return this.available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public EnumRole getEligibleRole() {
        return this.eligibleRole;
    }

    public void setEligibleRole(EnumRole eligibleRole) {
        this.eligibleRole = eligibleRole;
    }

    public long getMemory() {
        return this.memory;
    }

    public void setMemory(long memory) {
        this.memory = memory;
    }

    public int getVirtualCores() {
        return this.virtualCores;
    }

    public void setVirtualCores(int virtualCores) {
        this.virtualCores = virtualCores;
    }

    public List<String> getTags() {
        return this.tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

}
