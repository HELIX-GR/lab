package gr.helix.lab.web.model.ckan;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Package {

    @JsonProperty("creator_user_id")
    private String                           creatorUserId;
    @JsonProperty("author")
    private String                           author;
    @JsonProperty("author_email")
    private String                           authorEmail;
    @JsonProperty("id")
    private String                           id;
    @JsonProperty("maintainer")
    private String                           maintainer;
    @JsonProperty("maintainer_email")
    private String                           maintainerEmail;
    @JsonProperty("metadata_created")
    private String                           metadataCreated;
    @JsonProperty("metadata_modified")
    private String                           metadataModified;
    @JsonProperty("type")
    private String                           type;
    @JsonProperty("resources")
    private List<Resource>                   resources;
    @JsonProperty("num_resources")
    private int                              numOfResources;
    @JsonProperty("translation")
    private Map<String, Map<String, String>> translation;
    @JsonProperty("organization")
    private Organization                     organization;
    @JsonProperty("notes")
    private String                           notes;
    @JsonProperty("original_source")
    private String                           originalSource;
    @JsonProperty("title")
    private String                           title;
    @JsonProperty("revision_id")
    private String                           revisionId;
    @JsonProperty("identifier")
    private List<String>                     identifier;
    @JsonProperty("dataset_category")
    private List<String>                     categories;
    @JsonProperty("isopen")
    private boolean                          open;
    @JsonIgnore()
    private List<String>                     closedTags;
    @JsonIgnore()
    private List<Tag>                        tags;
    @JsonProperty("license_url")
    private String                           licenseUrl;
    @JsonProperty("license_title")
    private String                           licenseTitle;
    @JsonProperty("datacite")
    private DataCite                         datacite;
    @JsonProperty("name")
    private String                           name;

    public String getCreatorUserId() {
        return this.creatorUserId;
    }

    public void setCreatorUserId(String creatorUserId) {
        this.creatorUserId = creatorUserId;
    }

    public String getAuthor() {
        return this.author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getAuthorEmail() {
        return this.authorEmail;
    }

    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLicenseTitle() {
        return this.licenseTitle;
    }

    public void setLicenseTitle(String licenseTitle) {
        this.licenseTitle = licenseTitle;
    }

    public String getMaintainer() {
        return this.maintainer;
    }

    public void setMaintainer(String maintainer) {
        this.maintainer = maintainer;
    }

    public String getMaintainerEmail() {
        return this.maintainerEmail;
    }

    public void setMaintainerEmail(String maintainerEmail) {
        this.maintainerEmail = maintainerEmail;
    }

    public String getMetadataCreated() {
        return this.metadataCreated;
    }

    public void setMetadataCreated(String metadataCreated) {
        this.metadataCreated = metadataCreated;
    }

    public String getMetadataModified() {
        return this.metadataModified;
    }

    public void setMetadataModified(String metadataModified) {
        this.metadataModified = metadataModified;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Resource> getResources() {
        return this.resources;
    }

    public void setResources(List<Resource> resources) {
        this.resources = resources;
    }

    public int getNumOfResources() {
        return this.numOfResources;
    }

    public void setNumOfResources(int numOfResources) {
        this.numOfResources = numOfResources;
    }

    public Map<String, Map<String, String>> getTranslation() {
        return this.translation;
    }

    public void setTranslation(Map<String, Map<String, String>> translation) {
        this.translation = translation;
    }

    public Organization getOrganization() {
        return this.organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public String getNotes() {
        return this.notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getOriginalSource() {
        return this.originalSource;
    }

    public void setOriginalSource(String originalSource) {
        this.originalSource = originalSource;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRevisionId() {
        return this.revisionId;
    }

    public void setRevisionId(String revisionId) {
        this.revisionId = revisionId;
    }

    public List<String> getIdentifier() {
        return this.identifier;
    }

    public void setIdentifier(List<String> identifier) {
        this.identifier = identifier;
    }

    public List<String> getCategories() {
        return this.categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public boolean isOpen() {
        return this.open;
    }

    public void setOpen(boolean open) {
        this.open = open;
    }

    public String getLicenseUrl() {
        return this.licenseUrl;
    }

    public void setLicenseUrl(String licenseUrl) {
        this.licenseUrl = licenseUrl;
    }

    public DataCite getDatacite() {
        return this.datacite;
    }

    public void setDatacite(DataCite datacite) {
        this.datacite = datacite;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @JsonProperty("tags")
    public List<String> getTags() {
        List<String> result = new ArrayList<String>();
        if (this.tags != null) {
            result.addAll(this.tags.stream().map(Tag::getDisplayName).collect(Collectors.toList()));
        }
        if (this.closedTags != null) {
            result.addAll(this.closedTags);
        }
        return result;
    }

    @JsonProperty("tags")
    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    @JsonProperty("closed_tag")
    public void setClosedTags(List<String> closedTags) {
        this.closedTags = closedTags;
    }

}
