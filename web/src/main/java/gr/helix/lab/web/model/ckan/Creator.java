package gr.helix.lab.web.model.ckan;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Creator {

    @JsonProperty("creator_affiliation")
    private String affiliation;

    @JsonProperty("creator_name")
    private String name;

    public String getAffiliation() {
        return this.affiliation;
    }

    public void setAffiliation(String affiliation) {
        this.affiliation = affiliation;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
