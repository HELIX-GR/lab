package helix.lab.service;

import java.nio.file.Path;


public interface WebFileNamingStrategy extends FileNamingStrategy {

    Path resolveExecutionPath(String relativePath);

}