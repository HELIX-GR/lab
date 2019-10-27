package gr.helix.lab.userdata.rpc.service;

import java.util.function.Function;

public interface ProjectNamingStrategy
{
    String getProjectName(String userName);
}
