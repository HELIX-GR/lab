package gr.helix.lab.userdata.rpc.config;

import java.io.IOException;
import java.nio.file.FileStore;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.EnumSet;
import java.util.Set;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.Assert;

@Configuration
public class DataDirectoryConfiguration 
{
    private static final Set<PosixFilePermission> requiredPermissionsForNestedDirectory = 
        PosixFilePermissions.fromString("rwxrwxr-x");
    
    private Path userDataDirectory;

    private Path userDataMountpoint;
    
    @Autowired
    private void setUserDataDir(@Value("${helix.userdata.data-dir}") String value) 
    {
        final Path path = Paths.get(value);
        Assert.isTrue(path.isAbsolute(), "Expected an absolute directory path");
        this.userDataDirectory = path;
    }

    @Autowired
    private void setUserDataMountpoint(@Value("${helix.userdata.mountpoint}") String value) 
    {
        final Path path = Paths.get(value);
        Assert.isTrue(path.isAbsolute(), "Expected an absolute directory path");
        this.userDataMountpoint = path;
    }
    
    @PostConstruct
    private void checkDirectories() throws IOException 
    {
        if (!Files.isDirectory(this.userDataMountpoint)) {
            throw new IllegalStateException(
                "Expected a directory as the mountpoint of the XFS filesystem: " + this.userDataMountpoint);
        }
        
        final FileStore fileStore = Files.getFileStore(this.userDataMountpoint);
        if (!"xfs".equals(fileStore.type())) {
            throw new IllegalStateException(
                "The mountpoint at " + fileStore + " mounts a filesystem of wrong type: " + fileStore.type());
        }
        
        if (!Files.isDirectory(this.userDataDirectory)) {
            throw new IllegalStateException(
                "Expected a directory (for user data): " + this.userDataDirectory);
        }
        if (!Files.isWritable(this.userDataDirectory)) {
            throw new IllegalStateException(
                "The directory for user data is not writable: " + this.userDataDirectory);
        }
        
        if (!this.userDataDirectory.startsWith(this.userDataMountpoint)) {
            throw new IllegalStateException(
                "The directory for user data (" + this.userDataDirectory + ") must be  " +
                "under the mountpoint of the XFS filesystem (" + this.userDataMountpoint +")");
        }
        if (!fileStore.equals(Files.getFileStore(this.userDataDirectory))) {
            throw new IllegalStateException(
                "The directory for user data (" + this.userDataDirectory + ") belongs to another filesystem!");
        }
        
        // Check default permissions for new directories
        
        final Path testDir = userDataDirectory.resolve("_test_" + System.currentTimeMillis());
        
        Files.createDirectory(testDir);
        final Set<PosixFilePermission> requiredPermissions = 
            EnumSet.copyOf(requiredPermissionsForNestedDirectory);
        final Set<PosixFilePermission> actualPermissions = 
            Files.getPosixFilePermissions(testDir, LinkOption.NOFOLLOW_LINKS);
        requiredPermissions.removeAll(actualPermissions);
        if (!requiredPermissions.isEmpty()) {
            // This is probably a umask problem (must have a relaxed value of `0002`)
            throw new IllegalStateException(
                "The newly created directory at " + testDir + " lacks the following permissions: " + 
                requiredPermissions);
        }
        Files.delete(testDir);
    }

    @Bean
    Path userDataDirectory() 
    {
        return this.userDataDirectory;
    }

    @Bean
    Path userDataMountpoint() 
    {
        return this.userDataMountpoint;
    }
}