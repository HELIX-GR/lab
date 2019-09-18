package gr.helix.lab.web.config;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.Assert;

@Configuration
public class DataDirectoryConfiguration
{
    private Path tempDir;
    
    private Path catalogDataDir;
    
    private Path userDataDir;
    
    @Autowired
    private void setTempDir(@Value("${helix.temp-dir}") String d)
    {
        Path path = Paths.get(d);
        Assert.isTrue(path.isAbsolute(), "Expected an absolute directory path");
        this.tempDir = path;
    }
    
    @Autowired
    private void setCatalogDataDir(@Value("${helix.catalog.data-dir}") String d)
    {
        Path path = Paths.get(d);
        Assert.isTrue(path.isAbsolute(), "Expected an absolute directory path");
        this.catalogDataDir = path;
    }
    
    @Autowired
    private void setUserDataDir(@Value("${helix.users.data-dir}") String d)
    {
        Path path = Paths.get(d);
        Assert.isTrue(path.isAbsolute(), "Expected an absolute directory path");
        this.userDataDir = path;
    }
    
    @PostConstruct
    private void checkDirectories() throws IOException
    {
        Assert.state(Files.isDirectory(tempDir) && Files.isWritable(tempDir), 
            "Expected an existing writable directory for tempDir");
        
        for (Path dataDir: Arrays.asList(tempDir, catalogDataDir, userDataDir)) {
            if (!Files.isDirectory(dataDir))
                throw new IllegalStateException("Expected a directory: " + dataDir);
            if (!Files.isWritable(dataDir))
                throw new IllegalStateException("The directory is not writable: " + dataDir);
        }
    }
    
    @Bean
    Path tempDataDirectory()
    {
        return tempDir;
    }
    
    @Bean
    Path catalogDataDirectory()
    {
        return catalogDataDir;
    }
    
    @Bean
    Path userDataDirectory()
    {
        return userDataDir;
    }
    
}