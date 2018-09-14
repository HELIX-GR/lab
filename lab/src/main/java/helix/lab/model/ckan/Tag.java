package helix.lab.model.ckan;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Tag {

    @JsonProperty("vocabulary_id")
    private String vocabularyId;

    @JsonProperty("display_name")
    private String displayName;

    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    public String getVocabularyId() {
        return this.vocabularyId;
    }

    public void setVocabularyId(String vocabularyId) {
        this.vocabularyId = vocabularyId;
    }

    public String getDisplayName() {
        return this.displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
