package gr.helix.lab.userdata.rpc.service;

import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import gr.helix.core.common.model.user.AccountInfo;

@Service
public class DefaultProjectIdentifierStrategy implements ProjectIdentifierStrategy
{
    @Override
    public int toProjectId(AccountInfo userAccount)
    {
        Assert.notNull(userAccount, "Expected an AccountInfo object");
        return userAccount.getId().intValue();
    }

    @Override
    public AccountInfo fromProjectId(int projectId)
    {
        return new AccountInfo(projectId, null);
    }
}