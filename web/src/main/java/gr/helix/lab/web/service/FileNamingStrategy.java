package gr.helix.lab.web.service;

import java.io.IOException;
import java.nio.file.Path;

import gr.helix.lab.web.model.DirectoryInfo;


public interface FileNamingStrategy 
{
    /**
     * Get detailed info on a user's home directory.
     * 
     * <p>Note that the home directory is created, if not already present. 
     * 
     * @param userId
     * @return
     * @throws IOException
     */
    DirectoryInfo getUserDirectoryInfo(String userId) throws IOException;

    /**
     * Resolve a user's home directory as an absolute path. 
     * 
     * <p>This method will not interact in any way with the underlying filesystem; will
     * simply map a user id to a home directory.  
     * 
     * @param userId
     */
    Path getUserDir(String userId);
    
    /**
     * Resolve a user's home directory as an absolute path. If told so, attempt to create an
     * empty home directory (if it doesn't already exist).
     * 
     * @param userId
     * @param createIfNotExists
     * @throws IOException if an attempt to create the directory fails
     */
    Path getUserDir(String userId, boolean createIfNotExists) throws IOException;
    
    /**
     * Resolve a path against a user's home directory
     * 
     * @param userId
     * @param relativePath A relative path to be resolved
     * @return an absolute path
     */
    Path resolvePath(String userId, String relativePath);
    
    /**
     * Resolve a path against a user's home directory
     * @see FileNamingStrategy#resolvePath(int, String)  
     */
    Path resolvePath(String userId, Path relativePath);
}