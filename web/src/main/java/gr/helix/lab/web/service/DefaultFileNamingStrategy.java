package gr.helix.lab.web.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import gr.helix.lab.web.model.DirectoryInfo;
import gr.helix.lab.web.model.FileInfo;

@Service
public class DefaultFileNamingStrategy implements FileNamingStrategy
{
    private static final String WORKING_DIR_SUFFIX = "work";

    @Autowired
    private Path userDataDirectory;

    @Override
    public DirectoryInfo getUserDirectoryInfo(String userName) throws IOException
    {
        final Path userDir = this.getUserDir(userName, true);
        return this.createDirectoryInfo("", userDir, "/");
    }

    @Override
    public Path getUserDir(String userName)
    {
        Assert.isTrue(userName.length() > 0, "Expected a valid (> 0) user id");
        return this.userDataDirectory.resolve(Paths.get(userName, WORKING_DIR_SUFFIX));
    }

    @Override
    public Path getUserDir(String userName, boolean createIfNotExists)
        throws IOException
    {
        Assert.isTrue(userName.length()  > 0, "Expected a valid (> 0) user id");
        final Path userDir = this.getUserDir(userName);

        if (createIfNotExists) {
            Files.createDirectories(userDir);
        }

        return userDir;
    }

    @Override
    public Path resolvePath(String userName, String relativePath)
    {
        Assert.isTrue(!StringUtils.isEmpty(relativePath), "Expected a non-empty path");
        return this.resolvePath(userName, Paths.get(relativePath));
    }

    @Override
    public Path resolvePath(String userName, Path relativePath)
    {
        Assert.isTrue(userName.length() > 0, "Expected a valid (> 0) user id");
        Assert.notNull(relativePath, "Expected a non-null path");
        Assert.isTrue(!relativePath.isAbsolute(), "Expected a relative path to be resolved");
        final Path userDir = this.getUserDir(userName);
        return userDir.resolve(relativePath);
    }

    private DirectoryInfo createDirectoryInfo(String name, Path path, String relativePath)
    {
        final File file = path.toFile();

        final DirectoryInfo di = new DirectoryInfo(name, relativePath, this.toZonedDateTime(file.lastModified()), "Folder");

        for (final File f : file.listFiles()) {
            if (!f.getName().startsWith(".")) {
                if (f.isDirectory()) {
                    di.addFolder(this.createDirectoryInfo(f.getName(), f.toPath(), relativePath + f.getName() + "/"));
                }
                if (f.isFile()) {
                    di.addFile(this.createFileInfo(f, relativePath));
                }
            }
        }

        return di;
    }

    private FileInfo createFileInfo(File file, String path)
    {
        return new FileInfo(
            file.length(), file.getName(), path + file.getName(), this.toZonedDateTime(file.lastModified()), "File");
    }

    private ZonedDateTime toZonedDateTime(long millis)
    {
        final Instant i = Instant.ofEpochMilli(millis);
        return ZonedDateTime.ofInstant(i, ZoneOffset.UTC);
    }
}