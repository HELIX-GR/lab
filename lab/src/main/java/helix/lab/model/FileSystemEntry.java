package helix.lab.model;

import java.time.ZonedDateTime;

/**
 * Represents a file system entry. An entry can be either a file or a directory
 */
public abstract class FileSystemEntry {

    private long size;

    private String path;

    private String name;
    
    private String type;

    private ZonedDateTime createdOn;

    protected FileSystemEntry(long size, String name, String path, ZonedDateTime createdOn, String type) {
        this.size = size;
        this.name = name;
        this.path = path;
        this.createdOn = createdOn;
        this.type = type;
    }

    public long getSize() {
        return size;
    }

    public String getPath() {
        return path;
    }

    public String getName() {
        return name;
    }

    public ZonedDateTime getCreatedOn() {
        return createdOn;
    }

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}