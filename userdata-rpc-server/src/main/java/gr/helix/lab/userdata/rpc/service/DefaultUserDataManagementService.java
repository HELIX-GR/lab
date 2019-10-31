package gr.helix.lab.userdata.rpc.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
    
    @Value("${helix.userdata.quota.space.default-hard-limit}")
    private long defaultHardLimitForSpace;
    
    @Value("${helix.userdata.quota.inodes.default-hard-limit}")
    private int defaultHardLimitForInodes;

    private int softLimitPercentageForSpace;
    
    @Autowired
    private void setSoftLimitPercentageForSpace(
        @Value("${helix.userdata.quota.space.soft-limit-percentage:90}") int value)
    {
        Assert.isTrue(value > 0 && value <= 100, 
            "Expected a percentage: should be a integer between 1 and 100 (inclusive)");
        this.softLimitPercentageForSpace = value;
    }
    
    private int softLimitPercentageForInodes;
    
    @Autowired
    private void setSoftLimitPercentageForInodes(
        @Value("${helix.userdata.quota.inodes.soft-limit-percentage:90}") int value)
    {
        Assert.isTrue(value > 0 && value <= 100, 
            "Expected a percentage: should be a integer between 1 and 100 (inclusive)");
        this.softLimitPercentageForInodes = value;
    }
    
    @Autowired
    private FileNamingStrategy fileNamingStrategy;
    
    @Autowired
    private ProjectNamingStrategy projectNamingStrategy;
    
    @Autowired
    private ProjectIdentifierStrategy projectIdentifierStrategy;
    
    /**
     * The skeleton of every project given as (relative) names of folders
     */
    @Value("${helix.userdata.project-folders}")
    private String[] projectFolders;
    
    private void validateUserAccount(AccountInfo userAccount)
    {
        Assert.notNull(userAccount, "Expected an AccountInfo object");
        Assert.isTrue(userAccount.getId() != null && userAccount.getId() > 0, 
            "Expected a positive integer for a user\'s ID");
        Assert.isTrue(!StringUtils.isEmpty(userAccount.getName()), 
            "Expected a non-empty user name");
    }
    
    private Project resolveAsProject(AccountInfo userAccount)
    {
        final String userName = userAccount.getName();
        final Path path = fileNamingStrategy.getUserDir(userName);
        final int projectId = projectIdentifierStrategy.toProjectId(userAccount);
        final String projectName = projectNamingStrategy.getProjectName(userAccount);
        
        return Project.of(projectId, projectName, path, userDataMountpoint);
    }
    
    private UserDataReport toReport(ProjectReport r)
    {
        Assert.notNull(r, "Expected a ProjectReport object");
        return new UserDataReport(
            r.getUsedBytes(), r.getHardLimitForBytes(),r.getSoftLimitForBytes(),
            r.getUsedNumberOfFiles(), r.getHardLimitForInodes(), r.getSoftLimitForInodes());
    }
    
    private void createDirectories(Project project) throws IOException
    {
        final Path projectPath = project.path();
        
        Files.createDirectories(projectPath);
        
        for (String folderName: projectFolders) {
            Files.createDirectories(projectPath.resolve(folderName));
        }
    }
    
    @Override
    public boolean setupDirectory(AccountInfo userAccount, String serverHost, 
        Long quotaForSpace, Integer quotaForNumberOfFiles)
    {
        validateUserAccount(userAccount);
        final Project project = resolveAsProject(userAccount);
        
        // Create directories
        
        try {
            createDirectories(project);
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
    public Optional<UserDataReport> getReport(int accountId, String serverHost)
    {
        final int projectId = projectIdentifierStrategy.toProjectId(new AccountInfo(accountId, null));
        Optional<ProjectReport> r = null; 
        try {
            r = ProjectQuota.getReportForProject(projectId, userDataMountpoint);
        } catch (InterruptedException | IOException ex) {
            String errMessage = String.format(
                "Failed to get report for project #%d (for account #%d)", projectId, accountId);
            logger.error(errMessage, ex);
            r = Optional.empty();
        }
        return r.map(this::toReport);
    }

    @Override
    public List<Integer> listAccounts(String serverHost)
    {
        Map<Integer, Project> projectsMap = null;
        try {
            projectsMap = ProjectQuota.listProjects(userDataMountpoint);
        } catch (IOException | InterruptedException ex) {
            throw new IllegalStateException(ex);
        }
        return projectsMap.keySet().stream()
            .map(projectIdentifierStrategy::fromProjectId)
            .map(AccountInfo::getId)
            .collect(Collectors.toList());
    } 
}
