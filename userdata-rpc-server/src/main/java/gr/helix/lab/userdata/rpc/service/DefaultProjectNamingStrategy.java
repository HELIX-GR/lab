package gr.helix.lab.userdata.rpc.service;

import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import gr.helix.core.common.model.user.AccountInfo;

@Service
public class DefaultProjectNamingStrategy implements ProjectNamingStrategy
{
    @Override
    public String getProjectName(AccountInfo userAccount)
    {
        Assert.notNull(userAccount, "Expected an AccountInfo object");
        String userName = userAccount.getName();
        Assert.isTrue(!StringUtils.isEmpty(userName), "Expected a non-empty user name");
        String projectName = userName.replaceAll("@", "__at__").replaceAll("[-.]", "_");
        return projectName;
    }
}
