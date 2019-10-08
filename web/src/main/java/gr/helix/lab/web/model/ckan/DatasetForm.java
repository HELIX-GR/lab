package gr.helix.lab.web.model.ckan;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DatasetForm {

    public static class Tag {

        private final String name;

        public Tag(String name) {
            this.name = name;
        }

        public String getName() {
            return this.name;
        }

    }

    private String    name;

    private String    title;

    private String    notes;

    @JsonProperty("owner_org")
    private String    ownerOrganization;

    @JsonProperty("return_id_only")
    private boolean   returnIdOnly;

    @JsonProperty("maintainer_email")
    private String    maintainerEmail;

    private List<Tag> tags = new ArrayList<Tag>();

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNotes() {
        return this.notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getOwnerOrganization() {
        return this.ownerOrganization;
    }

    public void setOwnerOrganization(String ownerOrganization) {
        this.ownerOrganization = ownerOrganization;
    }

    public boolean isReturnIdOnly() {
        return this.returnIdOnly;
    }

    public void setReturnIdOnly(boolean returnIdOnly) {
        this.returnIdOnly = returnIdOnly;
    }

    public String getMaintainerEmail() {
        return this.maintainerEmail;
    }

    public void setMaintainerEmail(String maintainerEmail) {
        this.maintainerEmail = maintainerEmail;
    }

    public List<Tag> getTags() {
        return this.tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public void addTag(String value) {
        this.tags.add(new Tag(value));
    }

}
