package helix.lab.model.ckan;

import java.util.ArrayList;
import java.util.List;

public class CkanMetadata {

    String             host;

    List<License>      licenses;

    List<String>       formats;

    List<Tag>          tags;

    List<Group>        groups;

    List<Organization> organizations;

    public String getHost() {
        return this.host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public List<License> getLicenses() {
        return (this.licenses == null ? new ArrayList<License>() : this.licenses);
    }

    public void setLicenses(List<License> licenses) {
        this.licenses = licenses;
    }

    public List<String> getFormats() {
        return (this.formats == null ? new ArrayList<String>() : this.formats);
    }

    public void setFormats(List<String> formats) {
        this.formats = formats;
    }

    public List<Tag> getTags() {
        return (this.tags == null ? new ArrayList<Tag>() : this.tags);
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public List<Group> getGroups() {
        return (this.groups == null ? new ArrayList<Group>() : this.groups);
    }

    public void setGroups(List<Group> groups) {
        this.groups = groups;
    }

    public List<Organization> getOrganizations() {
        return (this.organizations == null ? new ArrayList<Organization>() : this.organizations);
    }

    public void setOrganizations(List<Organization> organizations) {
        this.organizations = organizations;
    }

}
