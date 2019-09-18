package helix.lab.model.ckan;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FacetCollection {

    @JsonProperty("license_id")
    private Map<String, Integer> licenses;

    @JsonProperty("tags")
    private Map<String, Integer> tags;

    @JsonProperty("res_format")
    private Map<String, Integer> formats;

    @JsonProperty("groups")
    private Map<String, Integer> groups;

    @JsonProperty("organization")
    private Map<String, Integer> organizations;

    public Map<String, Integer> getLicenses() {
        return this.licenses;
    }

    public void setLicenses(Map<String, Integer> licenses) {
        this.licenses = licenses;
    }

    public Map<String, Integer> getTags() {
        return this.tags;
    }

    public void setTags(Map<String, Integer> tags) {
        this.tags = tags;
    }

    public Map<String, Integer> getFormats() {
        return this.formats;
    }

    public void setFormats(Map<String, Integer> formats) {
        this.formats = formats;
    }

    public Map<String, Integer> getGroups() {
        return this.groups;
    }

    public void setGroups(Map<String, Integer> groups) {
        this.groups = groups;
    }

    public Map<String, Integer> getOrganizations() {
        return this.organizations;
    }

    public void setOrganizations(Map<String, Integer> organizations) {
        this.organizations = organizations;
    }

}
