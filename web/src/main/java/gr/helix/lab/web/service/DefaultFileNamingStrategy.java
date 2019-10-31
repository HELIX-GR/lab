package gr.helix.lab.web.service;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import gr.helix.core.common.service.FileNamingStrategy;

@Service
public class DefaultFileNamingStrategy implements FileNamingStrategy
{
    private static final Logger  logger = LoggerFactory.getLogger(CkanServiceProxy.class);

    private static final String WORKING_DIR_SUFFIX = "work";

    @Autowired
    private Path userDataDirectory;

    @Override
    public Path getUserDir(String userName)
    {
        Assert.isTrue(!StringUtils.isEmpty(userName), "Expected a non-empty user name");
        final Path path = this.userDataDirectory.resolve(Paths.get(userName, WORKING_DIR_SUFFIX));

        try {
            FileUtils.forceMkdir(path.toFile());
        } catch (final IOException ex) {
            logger.error("Failed to create directory " + path.toString(), ex);
        }

        return path;
    }

    @Override
    public Path resolvePath(String userName, Path relativePath)
    {
        Assert.isTrue(!StringUtils.isEmpty(userName), "Expected a non-empty user name");
        Assert.notNull(relativePath, "Expected a non-null path");
        Assert.isTrue(!relativePath.isAbsolute(), "Expected a relative path to be resolved");
        final Path userDir = this.getUserDir(userName);
        return userDir.resolve(relativePath);
    }
}