package gr.helix.lab.web.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import gr.helix.core.common.model.DirectoryInfo;
import gr.helix.core.common.service.FileNamingStrategy;

@Service
public class DefaultFileNamingStrategy implements FileNamingStrategy
{
    private static final String WORKING_DIR_SUFFIX = "work";

    @Autowired
    private Path userDataDirectory;
    
    @Override
    public Path getUserDir(String userName)
    {
        Assert.isTrue(!StringUtils.isEmpty(userName), "Expected a non-empty user name");
        return this.userDataDirectory.resolve(Paths.get(userName, WORKING_DIR_SUFFIX));
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