package helix.lab.model.ckan;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Resource {

    @JsonProperty("package_id")
    private String       packageId;

    @JsonProperty("id")
    private String       id;

    @JsonProperty("size")
    private Long         size;

    @JsonProperty("state")
    private String       state;

    @JsonProperty("description")
    private String       description;

    @JsonProperty("format")
    private String       format;

    @JsonProperty("last_modified")
    private String       lastModified;

    @JsonProperty("url_type")
    private String       urlType;

    @JsonProperty("access_url")
    private List<String> accessUrl;

    @JsonProperty("mimetype")
    private String       mimetype;

    @JsonProperty("name")
    private String       name;

    @JsonProperty("created")
    private String       created;

    @JsonProperty("url")
    private String       url;

    @JsonProperty("position")
    private int          position;

    @JsonProperty("revision_id")
    private String       revisionId;

    @JsonProperty("resource_type")
    private String       resourceType;

    public String getPackageId() {
        return this.packageId;
    }

    public void setPackageId(String packageId) {
        this.packageId = packageId;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getSize() {
        return this.size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public String getState() {
        return this.state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFormat() {
        return this.format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getLastModified() {
        return this.lastModified;
    }

    public void setLastModified(String lastModified) {
        this.lastModified = lastModified;
    }

    public String getUrlType() {
        return this.urlType;
    }

    public void setUrlType(String urlType) {
        this.urlType = urlType;
    }

    public List<String> getAccessUrl() {
        return this.accessUrl;
    }

    public void setAccessUrl(List<String> accessUrl) {
        this.accessUrl = accessUrl;
    }

    public String getMimetype() {
        return this.mimetype;
    }

    public void setMimetype(String mimetype) {
        this.mimetype = mimetype;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreated() {
        return this.created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public int getPosition() {
        return this.position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public String getRevisionId() {
        return this.revisionId;
    }

    public void setRevisionId(String revisionId) {
        this.revisionId = revisionId;
    }

    public String getResourceType() {
        return this.resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

}
