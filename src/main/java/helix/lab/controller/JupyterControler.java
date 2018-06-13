package helix.lab.controller;


import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.model.RestResponse;
import helix.lab.controller.action.BaseController;
import helix.lab.model.user.HubServerEntity;
import helix.lab.repository.HubServerRepository;
import helix.lab.service.JupyterApi;




@RestController
@Secured({ "ROLE_USER", "ROLE_ADMIN" })
@RequestMapping(produces = "application/json")
public class JupyterControler extends BaseController 
{   
	@Autowired
	HubServerRepository hubserverrepo;
	
	JupyterApi japi= new JupyterApi();
    

    @RequestMapping(value = "/action/start", method = RequestMethod.GET)
    public RestResponse<Object> start(HttpSession session, @RequestParam(required = false) String error) 
    {
    	Integer username=  currentUserId();
        if (error != null) {
      
            return RestResponse.error(null, error);
        }
        
        japi.api_request("info", "GET", null);
        japi.api_request("users", "GET", null);
		japi.api_request("users/"+username, "POST", null);
        
        //japi.api_request("authorizations/token", "POST", new HubUserCreate("totos", " "));
        japi.api_request("users/"+username+"/server", "POST", null);

        Object target="http://192.168.10.163:8000/user/"+username;
        
        
        return RestResponse.result(target);
    }
    
    @RequestMapping(value = "action/user/servers", method = RequestMethod.GET)
	public RestResponse<?> getServers(Authentication authentication) {
    	//authentication.getAuthorities().stream()
       // .map(r -> EnumRole.fromString(r.getAuthority()))
       // .filter(r -> r != null)
       // .forEach(r -> hse.setRole_eligible(r.toString()));

		System.out.println(authentication.getAuthorities());
			List<HubServerEntity> hsel = hubserverrepo.findAllByRole("ROLE_USER");
			System.out.println(hsel);
			return RestResponse.result(hsel);
			//return RestResponse.error(BasicErrorCode.IO_ERROR, "An unknown error has occurred");
	   
	}
    
    @RequestMapping(value = "/action/servers", method = RequestMethod.GET)
    public RestResponse<Object> server_info(HttpSession session, @RequestParam(required = false) String error) 
    {
        if (error != null) {
      
            return RestResponse.error(null, error);
        }
        Integer username= currentUserId();
        
        return RestResponse.result(japi.api_request("users/"+username, "GET", null));
    }

}