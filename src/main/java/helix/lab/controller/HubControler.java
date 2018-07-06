package helix.lab.controller;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.model.RestResponse;
import helix.lab.controller.action.BaseController;
import helix.lab.model.admin.HubServerEntity;
import helix.lab.model.hub.HubUserResponse;
import helix.lab.repository.HubServerRepository;
import helix.lab.service.JupyterApi;




@RestController
@Secured({ "ROLE_STANDARD", "ROLE_ADMIN" })
@RequestMapping(produces = "application/json")
public class HubControler extends BaseController 
{   
	@Autowired
	HubServerRepository hubserverrepo;
	
	JupyterApi japi= new JupyterApi();
    

    @RequestMapping(value = "/action/start/{chosen_hub_id}", method = RequestMethod.GET)
    public RestResponse<Object> start(Authentication authentication, @PathVariable int chosen_hub_id, @RequestParam(required = false) String error) 
    {
    	String username=  currentUserName();
        if (error != null) {
      
            return RestResponse.error(null, error);
        }
        Optional<HubServerEntity> hub = hubserverrepo.findById(chosen_hub_id);
        
        
        //check authorities for this hub
        Boolean isEligable=false;
    	for ( GrantedAuthority  E:authentication.getAuthorities()){
			if (E.toString().equals(hub.get().getRole_eligible())) {
				isEligable=true;
				break;
				}
    	}
        if (isEligable) {
        //TODO add hit to database S2U connection
        	HubUserResponse respo = null;
        try {
        	respo = japi.hub_user_info(hub.get(),"users/"+username);//see if user is in hubs whitelist
        	System.out.println(respo.toString());
        } catch (IOException e) {
            try {
            	japi.api_request(hub.get(),"users/"+username, "POST", null);// add user to hub and the whitelist
            }catch(IOException a) {
        	return RestResponse.error(null, a.getMessage() );
            }
		}
		if (respo == null || respo.getServer()==null) {
        	try {
        		japi.api_request(hub.get(),"users/"+username+"/server", "POST", null);// start a notebook server for this user
                
                } catch (IOException e) {
                	return RestResponse.error(null, e.getMessage() );

        		}
		}
		
        Object target=hub.get().getUrl()+":8000/user/"+username;
        
        
        return RestResponse.result(target);}
        else {
        	return RestResponse.error(null, "Cant open this server");
        }
    }
    
    @RequestMapping(value = "action/user/servers", method = RequestMethod.GET)
	public RestResponse<?> getServers(Authentication authentication) {
    
    	List<HubServerEntity> hsel = new ArrayList<HubServerEntity>();
		System.out.println(authentication.getAuthorities());
		for ( GrantedAuthority  E:authentication.getAuthorities()){
			hsel.addAll(hubserverrepo.findAllByRole(E.toString())); }
		
			return RestResponse.result(hsel);
			//return RestResponse.error(BasicErrorCode.IO_ERROR, "An unknown error has occurred");
	   
	}
    
   /* @RequestMapping(value = "/action/servers", method = RequestMethod.GET)
    public RestResponse<Object> server_info(HttpSession session, @RequestParam(required = false) String error) 
    {
        if (error != null) {
      
            return RestResponse.error(null, error);
        }
        Integer username= currentUserId();
        
        return RestResponse.result(japi.api_request("users/"+username, "GET", null));
    }*/

}