package gr.helix.lab.userdata.rpc.service;

import java.nio.file.Path;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import gr.helix.core.common.model.user.AccountInfo;
import gr.helix.core.common.model.user.UserDataReport;
import gr.helix.core.common.service.FileNamingStrategy;
import gr.helix.core.common.service.UserDataManagementService;
import gr.helix.util.xfs.Project;

@Service
public class DefaultUserDataManagementService implements UserDataManagementService
{
    private static final Logger logger = LoggerFactory.getLogger(DefaultUserDataManagementService.class);
    
    @Autowired
    private Path userDataMountpoint;
        
    @Value("${helix.userdata.quota.space.default-hard-limit}")
    private long defaultHardLimitForSpace;
    
    @Value("${helix.userdata.quota.space.soft-limit-percentage:90}")
    private int softLimitPercentageForSpace;
    
    @Value("${helix.userdata.quota.inodes.default-hard-limit}")
    private long defaultHardLimitForInodes;
    
    @Value("${helix.userdata.quota.inodes.soft-limit-percentage:90}")
    private int softLimitPercentageForInodes;

    @Autowired
    private FileNamingStrategy fileNamingStrategy;
    
    @Autowired
    private ProjectNamingStrategy projectNamingStrategy;
    
    @PostConstruct
    void checkDirectory()
    {
        // Todo checkDirectory
        logger.info("Initialized");
    }
    
    protected void validateUserAccount(AccountInfo userAccount)
    {
        Assert.notNull(userAccount, "Expected an AccountInfo object");
        Assert.isTrue(userAccount.getId() != null && userAccount.getId() > 0, 
            "Expected a positive integer for a user\'s ID");
        Assert.isTrue(!StringUtils.isEmpty(userAccount.getName()), 
            "Expected a non-empty user name");
    }
    
    protected Project resolveAsProject(AccountInfo userAccount)
    {
        final String userName = userAccount.getName();
        final Path path = fileNamingStrategy.getUserDir(userName);
        final int projectId = userAccount.getId();
        final String projectName = projectNamingStrategy.getProjectName(userName);
        
        return Project.of(projectId, projectName, path, userDataMountpoint);
    }
    
    @Override
    public boolean setupDirs(AccountInfo userAccount, String serverHost, 
        Long quotaForSpace, Long quotaForNumberOfFiles)
    {
        validateUserAccount(userAccount);
        final Project project = resolveAsProject(userAccount);
        
        // Todo create dirs
        
        // Todo Setup project
        
        // Todo Set quota (if not there or if changed)
        
        return false;
    }

    @Override
    public boolean cleanupDirs(AccountInfo userAccount, String serverHost, boolean deleteDirs)
    {
        validateUserAccount(userAccount);
        
        // Todo Auto-generated method stub
        return false;
    }

    @Override
    public UserDataReport getReport(AccountInfo userAccount)
    {
        validateUserAccount(userAccount);
        
        // Todo Auto-generated method stub
        return null;
    } 
}
