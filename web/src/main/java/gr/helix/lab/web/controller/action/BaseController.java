package gr.helix.lab.web.controller.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import gr.helix.core.common.repository.AccountRepository;
import gr.helix.lab.web.repository.AccountToServerRepository;
import gr.helix.lab.web.repository.AccountWhiteListRepository;
import gr.helix.lab.web.service.DefaultWebFileNamingStrategry;
import gr.helix.lab.web.service.IAuthenticationFacade;

public abstract class BaseController {

    @Autowired
    private IAuthenticationFacade authenticationFacade;
    
    @Autowired
	protected AccountRepository aer;
	
	@Autowired
	protected AccountWhiteListRepository awlr;
	
	@Autowired
	protected AccountToServerRepository atsr;
	

    @Autowired
    @Qualifier("defaultWebFileNamingStrategry")
    protected DefaultWebFileNamingStrategry fileNamingStrategy;
    
    protected int currentUserId() {
    

        return this.authenticationFacade.getCurrentUserId();
    }
    protected String currentUserName() {
        

        return this.authenticationFacade.getCurrentUser().getUsername();
    }
}
