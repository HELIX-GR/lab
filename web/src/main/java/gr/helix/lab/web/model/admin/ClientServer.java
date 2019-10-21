package gr.helix.lab.web.model.admin;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import gr.helix.core.common.model.EnumRole;

public class ClientServer {

    private Integer       id;

    private String        name;

    private String        description;

    private String        url;

    private Boolean       available;

    private String        token;

    private ZonedDateTime startedAt;

    private EnumRole      eligibleRole;

    private long          memory;

    private int           virtualCores;

    private List<String>  tags    = new ArrayList<>();

    private List<String>  kernels = new ArrayList<>();

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public ZonedDateTime getStartedAt() {
        return this.startedAt;
    }

    public void setStartedAt(ZonedDateTime startedAt) {
        this.startedAt = startedAt;
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

    @JsonProperty
    public List<String> getKernels() {
        return this.kernels;
    }

    @JsonIgnore
    public void setKernels(List<String> kernels) {
        this.kernels = kernels;
    }

}
