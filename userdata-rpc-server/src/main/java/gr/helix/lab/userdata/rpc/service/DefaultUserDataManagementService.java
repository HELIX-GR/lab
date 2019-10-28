package gr.helix.lab.userdata.rpc.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.Arrays;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.NotImplementedException;
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
import gr.helix.util.xfs.ProjectQuota;
import gr.helix.util.xfs.ProjectReport;

@Service
public class DefaultUserDataManagementService implements UserDataManagementService
{
    private static final Logger logger = LoggerFactory.getLogger(DefaultUserDataManagementService.class);
    
    @Autowired
    private Path userDataMountpoint;
     
    @Autowired
    private Path userDataDirectory;
    
    @Value("${helix.userdata.quota.space.default-hard-limit}")
    private long defaultHardLimitForSpace;
    
    @Value("${helix.userdata.quota.space.soft-limit-percentage:90}")
    private int softLimitPercentageForSpace;
    
    @Value("${helix.userdata.quota.inodes.default-hard-limit}")
    private int defaultHardLimitForInodes;
    
    @Value("${helix.userdata.quota.inodes.soft-limit-percentage:90}")
    private int softLimitPercentageForInodes;

    @Autowired
    private FileNamingStrategy fileNamingStrategy;
    
    @Autowired
    private ProjectNamingStrategy projectNamingStrategy;
    
    void validateUserAccount(AccountInfo userAccount)
    {
        Assert.notNull(userAccount, "Expected an AccountInfo object");
        Assert.isTrue(userAccount.getId() != null && userAccount.getId() > 0, 
            "Expected a positive integer for a user\'s ID");
        Assert.isTrue(!StringUtils.isEmpty(userAccount.getName()), 
            "Expected a non-empty user name");
    }
    
    Project resolveAsProject(AccountInfo userAccount)
    {
        final String userName = userAccount.getName();
        final Path path = fileNamingStrategy.getUserDir(userName);
        final int projectId = userAccount.getId();
        final String projectName = projectNamingStrategy.getProjectName(userName);
        
        return Project.of(projectId, projectName, path, userDataMountpoint);
    }
    
    UserDataReport createReport(ProjectReport r)
    {
        Assert.notNull(r, "Expected a ProjectReport object");
        return new UserDataReport(
            r.getUsedBytes(), r.getHardLimitForBytes(),r.getSoftLimitForBytes(),
            r.getUsedNumberOfFiles(), r.getHardLimitForInodes(), r.getSoftLimitForInodes());
    }
    
    @Override
    public boolean setupDirectory(AccountInfo userAccount, String serverHost, 
        Long quotaForSpace, Integer quotaForNumberOfFiles)
    {
        validateUserAccount(userAccount);
        final Project project = resolveAsProject(userAccount);
        
        // Create directories
        
        try {
            Files.createDirectories(project.path());
        } catch (IOException ex) {
            logger.error("Failed to create directory for project #%d" + project.id(), ex);
            return false;
        }
        
        // Setup project
        
        try {
            ProjectQuota.setupProject(project);
        } catch (InterruptedException | IOException ex) {
            logger.error("Failed to setup quota enforcement for project #%d" + project.id(), ex);
            return false;
        }
        
        // Set quota (if unset, or if must be updated)
        
        if (quotaForSpace == null)
            quotaForSpace = Long.valueOf(defaultHardLimitForSpace);
        
        if (quotaForNumberOfFiles == null)
            quotaForNumberOfFiles = Integer.valueOf(defaultHardLimitForInodes);
        
        ProjectReport projectReport = null; 
        try {
            projectReport = ProjectQuota.getReportForProject(project).get();
        } catch (InterruptedException | IOException ex) {
            logger.error("Failed to get quota report for project #%d" + project.id(), ex);
            return false;
        }
        logger.debug("{}", projectReport);
        
        if (!quotaForSpace.equals(projectReport.getHardLimitForBytes())) {            
            final int hardLimitKbytes = Math.toIntExact(quotaForSpace.longValue() / 1024L);
            final int softLimitKbytes =
                Math.toIntExact((quotaForSpace.longValue() * softLimitPercentageForSpace) / 100L / 1024L);
            try {
                ProjectQuota.setQuotaForSpace(project, softLimitKbytes, hardLimitKbytes);
            } catch (InterruptedException | IOException ex) {
                logger.error("Failed to set space quota for project #%d" + project.id(), ex);
                return false;
            }
        }
        
        if (!quotaForNumberOfFiles.equals(projectReport.getHardLimitForInodes())) {
            final int hardLimit = quotaForNumberOfFiles.intValue();
            final int softLimit = (quotaForNumberOfFiles.intValue() * softLimitPercentageForInodes) / 100;
            try {
                ProjectQuota.setQuotaForInodes(project, softLimit, hardLimit);
            } catch (InterruptedException | IOException ex) {
                logger.error("Failed to set inode quota for project #%d" + project.id(), ex);
                return false;
            }
        }
        
        return true;
    }

    @Override
    public boolean cleanupDirectory(AccountInfo userAccount, String serverHost, boolean deleteDirs)
    {
        validateUserAccount(userAccount);
        final Project project = resolveAsProject(userAccount);
        
        if (!Files.isDirectory(project.path(), LinkOption.NOFOLLOW_LINKS)) {
            return true; // consider as cleaned-up
        }
        
        try {
            ProjectQuota.cleanupProject(project);
        } catch (InterruptedException | IOException ex) {
            logger.error("Failed to cleanup project #%d" + project.id(), ex);
            return false;
        }
        
        if (deleteDirs) {
            Stream<File> filesToDelete = null; 
            try {
                filesToDelete = Files.walk(project.path()).map(Path::toFile);
            } catch (IOException ex) {
                throw new IllegalStateException(ex);
            }
            filesToDelete.sorted(Comparator.reverseOrder()).forEach(File::delete);
        }
        
        return true;
    }

    @Override
    public Optional<UserDataReport> getReport(AccountInfo userAccount)
    {
        validateUserAccount(userAccount);
        final Project project = resolveAsProject(userAccount);
        Optional<ProjectReport> r = null; 
        try {
            r = ProjectQuota.getReportForProject(project);
        } catch (InterruptedException | IOException ex) {
            logger.error("Failed to get report for project #" + project.id(), ex);
            r = Optional.empty();
        }
        return r.map(this::createReport);
    } 
}
