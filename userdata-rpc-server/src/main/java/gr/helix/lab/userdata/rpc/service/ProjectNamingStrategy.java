package gr.helix.lab.userdata.rpc.service;

import gr.helix.core.common.model.user.AccountInfo;

public interface ProjectNamingStrategy
{
    String getProjectName(AccountInfo userAccount);
}
