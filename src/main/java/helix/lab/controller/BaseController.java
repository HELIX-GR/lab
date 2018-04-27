package helix.lab.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import helix.lab.service.DefaultWebFileNamingStrategry;
import helix.lab.service.AuthenticationFacade;


public abstract class BaseController {

    @Autowired
    private AuthenticationFacade authenticationFacade;

    @Autowired
    @Qualifier("defaultWebFileNamingStrategry")
    protected DefaultWebFileNamingStrategry fileNamingStrategy;

    protected int currentUserId() 
    {
        return 1;//this.authenticationFacade.getCurrentUserId() ;
    }

}