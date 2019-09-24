package gr.helix.lab.web.config;

import java.io.IOException;
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
public class DataDirectoryConfiguration {

    private Path tempDir;

    private Path userDataDir;

    @Autowired
    private void setTempDir(@Value("${helix.temp-dir}") String value) {
        final Path path = Paths.get(value);
        Assert.isTrue(path.isAbsolute(), "Expected an absolute directory path");
        this.tempDir = path;
    }

    @Autowired
    private void setUserDataDir(@Value("${helix.users.data-dir}") String value) {
        final Path path = Paths.get(value);
        Assert.isTrue(path.isAbsolute(), "Expected an absolute directory path");
        this.userDataDir = path;
    }

    @PostConstruct
    private void checkDirectories() throws IOException {
        for (final Path dataDir : Arrays.asList(this.tempDir, this.userDataDir)) {
            if (!Files.isDirectory(dataDir)) {
                throw new IllegalStateException("Expected a directory: " + dataDir);
            }
            if (!Files.isWritable(dataDir)) {
                throw new IllegalStateException("The directory is not writable: " + dataDir);
            }
        }
    }

    @Bean
    Path tempDataDirectory() {
        return this.tempDir;
    }

    @Bean
    Path userDataDirectory() {
        return this.userDataDir;
    }

}