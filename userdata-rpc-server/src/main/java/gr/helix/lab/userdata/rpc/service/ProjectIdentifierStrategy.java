package gr.helix.lab.userdata.rpc.service;

import gr.helix.core.common.model.user.AccountInfo;

public interface ProjectIdentifierStrategy
{
    int toProjectId(AccountInfo userAccount);
    
    default AccountInfo fromProjectId(int projectId)
    {
        throw new UnsupportedOperationException();
    }
}
