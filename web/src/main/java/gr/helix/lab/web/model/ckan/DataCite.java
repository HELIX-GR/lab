package gr.helix.lab.web.model.ckan;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DataCite {

    @JsonProperty("languagecode")
    private String  languageCode;
    @JsonProperty("abstract")
    private String  abstractDescription;
    @JsonProperty("optional_description")
    private String  optionalDescription;
    @JsonProperty("contact_email")
    private String  contactEmail;
    @JsonProperty("title")
    private String  title;
    @JsonProperty("optional_title")
    private String  optionalTitle;
    @JsonProperty("thematic_category")
    private String  thematicCategory;
    @JsonProperty("creator")
    private Creator creator;

    public String getLanguageCode() {
        return this.languageCode;
    }

    public void setLanguageCode(String languageCode) {
        this.languageCode = languageCode;
    }

    public String getAbstractDescription() {
        return this.abstractDescription;
    }

    public void setAbstractDescription(String abstractDescription) {
        this.abstractDescription = abstractDescription;
    }

    public String getOptionalDescription() {
        return this.optionalDescription;
    }

    public void setOptionalDescription(String optionalDescription) {
        this.optionalDescription = optionalDescription;
    }

    public String getContactEmail() {
        return this.contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOptionalTitle() {
        return this.optionalTitle;
    }

    public void setOptionalTitle(String optionalTitle) {
        this.optionalTitle = optionalTitle;
    }

    public String getThematicCategory() {
        return this.thematicCategory;
    }

    public void setThematicCategory(String thematicCategory) {
        this.thematicCategory = thematicCategory;
    }

    public Creator getCreator() {
        return this.creator;
    }

    public void setCreator(Creator creator) {
        this.creator = creator;
    }

}
