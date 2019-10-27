package gr.helix.lab.userdata.rpc.config;

import java.io.IOException;
import java.nio.file.FileStore;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.Assert;

@Configuration
public class DataDirectoryConfiguration {

    private Path userDataDir;

    private Path userDataMountpoint;
    
    @Autowired
    private void setUserDataDir(@Value("${helix.userdata.data-dir}") String value) 
    {
        final Path path = Paths.get(value);
        Assert.isTrue(path.isAbsolute(), "Expected an absolute directory path");
        this.userDataDir = path;
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
        
        if (!Files.isDirectory(this.userDataDir)) {
            throw new IllegalStateException(
                "Expected a directory (for user data): " + this.userDataDir);
        }
        if (!Files.isWritable(this.userDataDir)) {
            throw new IllegalStateException(
                "The directory for user data is not writable: " + this.userDataDir);
        }
        
        if (!this.userDataDir.startsWith(this.userDataMountpoint)) {
            throw new IllegalStateException(
                "The directory for user data (" + this.userDataDir + ") must be  " +
                "under the mountpoint of the XFS filesystem (" + this.userDataMountpoint +")");
        }
        if (!fileStore.equals(Files.getFileStore(this.userDataDir))) {
            throw new IllegalStateException(
                "The directory for user data (" + this.userDataDir + ") belongs to another filesystem!");
        }
    }

    @Bean
    Path userDataDirectory() 
    {
        return this.userDataDir;
    }

    @Bean
    Path userDataMountpoint() 
    {
        return this.userDataMountpoint;
    }
}