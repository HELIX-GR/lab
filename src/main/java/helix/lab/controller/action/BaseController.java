package helix.lab.controller.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import helix.lab.service.DefaultWebFileNamingStrategry;
import helix.lab.service.IAuthenticationFacade;

public abstract class BaseController {

    @Autowired
    private IAuthenticationFacade authenticationFacade;

    @Autowired
    @Qualifier("defaultWebFileNamingStrategry")
    protected DefaultWebFileNamingStrategry fileNamingStrategy;
    
    protected int currentUserId() {
        return this.authenticationFacade.getCurrentUserId();
    }

}
