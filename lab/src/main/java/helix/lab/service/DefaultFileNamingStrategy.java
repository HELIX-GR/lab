package helix.lab.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
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

import helix.lab.model.DirectoryInfo;
import helix.lab.model.FileInfo;


@Service
public class DefaultFileNamingStrategy implements FileNamingStrategy
{
    @Autowired
    private Path userDataDirectory;

    @Override
    public DirectoryInfo getUserDirectoryInfo(String string) throws IOException
    {
        final Path userDir = getUserDir(string, true);
        return createDirectoryInfo("/", userDir, "");
    }

    @Override
    public Path getUserDir(String userName)
    {
        Assert.isTrue(userName.length() > 0, "Expected a valid (> 0) user id");
        return userDataDirectory.resolve(userName);
    }

    @Override
    public Path getUserDir(String userName, boolean createIfNotExists)
        throws IOException
    {
        Assert.isTrue(userName.length()  > 0, "Expected a valid (> 0) user id");
        Path userDir = getUserDir(userName);

        if (createIfNotExists) {
            try {
                Files.createDirectory(userDir);
            } catch (FileAlreadyExistsException ex) {}
        }

        return userDir;
    }

    @Override
    public Path resolvePath(String userName, String relativePath)
    {
        Assert.isTrue(!StringUtils.isEmpty(relativePath), "Expected a non-empty path");
        return resolvePath(userName, Paths.get(relativePath));
    }

    @Override
    public Path resolvePath(String userName, Path relativePath)
    {
        Assert.isTrue(userName.length() > 0, "Expected a valid (> 0) user id");
        Assert.notNull(relativePath, "Expected a non-null path");
        Assert.isTrue(!relativePath.isAbsolute(), "Expected a relative path to be resolved");
        Path userDir = getUserDir(userName);
        return userDir.resolve(relativePath);
    }

    private DirectoryInfo createDirectoryInfo(String name, Path path, String relativePath)
    {
        final File file = path.toFile();

        final DirectoryInfo di = new DirectoryInfo(name, relativePath, toZonedDateTime(file.lastModified()), "Folder");

        for (File f : file.listFiles()) {
        	if (!f.getName().startsWith(".")) {// Hidden files.
        		
        	
            if (f.isDirectory()) {
                di.addFolder(createDirectoryInfo(f.getName(), f.toPath(), relativePath + f.getName() + "/"));
            }
            if (f.isFile()) {
                di.addFile(createFileInfo(f, relativePath));
            }}
        }

        return di;
    }

    private FileInfo createFileInfo(File file, String path)
    {
        return new FileInfo(
            file.length(), file.getName(), path + file.getName(), toZonedDateTime(file.lastModified()), "File");
    }

    private ZonedDateTime toZonedDateTime(long millis)
    {
        Instant i = Instant.ofEpochMilli(millis);
        return ZonedDateTime.ofInstant(i, ZoneOffset.UTC);
    }
}