package gr.helix.lab.web.model;

import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class PublishRequest {

    @NotNull(message = "Title is a required field")
    @Size(min = 4, max = 100)
    private String       title;

    private String       path;
    @NotNull
    @Size(min = 4, max = 100)
    private String       filename;

    @NotNull
    @Size(min = 4, max = 100)
    private String       filerename;

    private String       description;

    @NotNull
    private String       lang;

    private List<String> tags;

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPath() {
        return this.path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getFilename() {
        return this.filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getFilerename() {
        return this.filerename;
    }

    public void setFilerename(String filerename) {
        this.filerename = filerename;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLang() {
        return this.lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public List<String> getTags() {
        return this.tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    @Override
    public String toString() {
        return "PublishRequest [title=" + this.title + ", path=" + this.path + ", filename=" + this.filename + ", filerename="
                + this.filerename + ", description=" + this.description + ", lang=" + this.lang + "]";
    }

}