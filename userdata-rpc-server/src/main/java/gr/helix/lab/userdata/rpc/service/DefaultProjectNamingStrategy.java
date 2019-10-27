package gr.helix.lab.userdata.rpc.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.vividsolutions.jts.util.Assert;

@Service
public class DefaultProjectNamingStrategy implements ProjectNamingStrategy
{
    @Override
    public String getProjectName(String userName)
    {
        Assert.isTrue(!StringUtils.isEmpty(userName), "Expected a non-empty user name");
        return userName.replaceAll("@", "__at__").replace('.', '_');
    }
}
