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
import helix.lab.model.user.AccountToServerEntity;
import helix.lab.repository.HubServerRepository;
import helix.lab.service.JupyterApi;




@RestController
@Secured({ "ROLE_STANDARD", "ROLE_ADMIN" })
@RequestMapping(produces = "application/json")
public class HubController extends BaseController 
{   
	@Autowired
	HubServerRepository hubserverrepo;
	

	
	JupyterApi japi= new JupyterApi();
    

    @RequestMapping(value = "/action/start/{chosen_hub_id}", method = RequestMethod.POST)
    public RestResponse<Object> start(Authentication authentication, @PathVariable int chosen_hub_id,  @RequestParam(required = false) String error)
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
    	List<AccountToServerEntity> a2sl= atsr.findAllServersByUserId(currentUserId());
    	HubUserResponse respo = null;

    	if (!a2sl.isEmpty()) { // Check if i have it in db
            Object target=hub.get().getUrl()+":8000/user/"+username;
            try {
            	respo = japi.hub_user_info(hub.get(),"users/"+username);//see if its active in the hub
            } catch (IOException e) {
            //skip
            }
            if (respo.getServer()==null) {// If there is not active in the hub but we have a db entry then delete it
            	atsr.delete(a2sl.get(0)); //
            }
            else {
            return RestResponse.result(target);
            }
    	}
    	
    	
    	
        if (isEligable ) {
        	AccountToServerEntity atse=	new AccountToServerEntity();
        	atse.setAccount(aer.getOne(currentUserId()));
        	atse.setHubServer(hub.get());
        	atse.setName(hub.get().getName());
        try {
        	respo = japi.hub_user_info(hub.get(),"users/"+username);//see if user is in hubs whitelist
        	//System.out.println(respo.toString());
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
		atse.setUrl(hub.get().getUrl()+":8000/user/"+username);
		atse.setState("Active");
		
		atsr.save(atse);
        Object target=hub.get().getUrl()+":8000/user/"+username;
        
        
        return RestResponse.result(target);}
        else {
        	return RestResponse.error(null, "Cant open this server");
        }
    }
    

	@RequestMapping(value = "action/stop/{chosen_hub_id}", method = RequestMethod.DELETE)
    public RestResponse<Void> stop_server(@PathVariable int chosen_hub_id) 
    {
    	String username=  currentUserName();

        Optional<HubServerEntity> hub = hubserverrepo.findById(chosen_hub_id);
       
        System.out.println("user "+ username+" deleting server");
    	try {
    		japi.delete_user_server(hub.get(),"users/"+username+"/server");// stop notebook server for this user
            
            } catch (IOException e) {
            	return RestResponse.error(null, e.getMessage() );

    		}
    	List<AccountToServerEntity> a2sl= atsr.findAllServersByUserId(currentUserId());
    	if (!a2sl.isEmpty()) {
    		atsr.delete(a2sl.get(0));
    	}
        return RestResponse.success();
       
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