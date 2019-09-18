package gr.helix.lab.web.model;

import java.time.ZonedDateTime;

/**
 * A file system entry for a file
 */
public class FileInfo extends FileSystemEntry {

    public FileInfo(long size, String name, String path, ZonedDateTime createdOn, String type) {
        super(size, name, path, createdOn, "file");
    }

}