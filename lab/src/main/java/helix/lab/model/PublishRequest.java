package helix.lab.model;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class PublishRequest {
	
	@NotNull(message = "Title is a required field")
	@Size(min = 4, max = 100)
	private String title;
	
    private String path;
    @NotNull
	@Size(min = 4, max = 100)
    private String filename;
    @NotNull
	@Size(min = 4, max = 100)
    private String filerename;

    private String description;
	
    @NotNull
    private String lang;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public String getFilerename() {
		return filerename;
	}

	public void setFilerename(String filerename) {
		this.filerename = filerename;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getLang() {
		return lang;
	}

	public void setLang(String lang) {
		this.lang = lang;
	}

	@Override
	public String toString() {
		return "PublishRequest [title=" + title + ", path=" + path + ", filename=" + filename + ", filerename="
				+ filerename + ", description=" + description + ", lang=" + lang + "]";
	}
    
   

}