package gr.helix.lab.userdata.rpc.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import gr.helix.core.common.model.user.AccountInfo;
import gr.helix.core.common.service.UserDataManagementService;
import gr.helix.core.common.service.UserDataReport;

@Service
public class DefaultUserDataManagementService implements UserDataManagementService
{
    private static final Logger logger = LoggerFactory.getLogger(DefaultUserDataManagementService.class);

    @Override
    public boolean setupDirs(AccountInfo userAccount, String serverHost, Long spaceQuota)
    {
        // Todo Auto-generated method stub
        return false;
    }

    @Override
    public boolean cleanupDirs(AccountInfo userAccount, String serverHost, boolean deleteDirs)
    {
        // Todo Auto-generated method stub
        return false;
    }

    @Override
    public UserDataReport reportUsage(AccountInfo userAccount)
    {
        // Todo Auto-generated method stub
        return null;
    } 
}
