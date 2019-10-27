package gr.helix.lab.userdata.rpc.service;

import java.nio.file.Path;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import gr.helix.core.common.service.FileNamingStrategy;

@Service
public class DefaultFileNamingStrategy implements FileNamingStrategy
{
    /**
     * A simple and quite restrictive pattern to validate user names as emails
     */
    private final Pattern emailPattern = Pattern.compile(
        "^([a-z0-9][-_a-z0-9]*[.]){0,3}[a-z0-9][-_a-z0-9]*" + 
            "@([a-z0-9][-a-z0-9]*[.]){0,2}[a-z0-9][-a-z0-9]*$", 
        Pattern.CASE_INSENSITIVE); 
    
    private final int userNameMaxLength = 48;
    
    private final int userNameMinLength = 6;
    
    @Autowired
    private Path userDataDirectory;
   
    private void validateUserName(String userName)
    {
        Assert.isTrue(!StringUtils.isEmpty(userName), "The user name cannot be empty!");
        Assert.isTrue(userName.length() >= userNameMinLength, "The user name is too short");
        Assert.isTrue(userName.length() <= userNameMaxLength, "The user name is too long");
        Assert.isTrue(emailPattern.matcher(userName).matches(), "The user name should be a valid email address");
    }
    
    @Override
    public Path getUserDir(String userName)
    {        
        validateUserName(userName);
        return this.userDataDirectory.resolve(userName);
    }
    
    @Override
    public Path resolvePath(String userName, Path relativePath)
    {
        validateUserName(userName);
        Assert.notNull(relativePath, "Expected a non-null path");
        Assert.isTrue(!relativePath.isAbsolute(), "Expected a relative path to be resolved");
        final Path userDir = this.getUserDir(userName);
        return userDir.resolve(relativePath);
    }
}