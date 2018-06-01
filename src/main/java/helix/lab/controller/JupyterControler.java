package helix.lab.controller;


import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import gr.helix.core.common.model.RestResponse;
import helix.lab.service.JupyterApi;




@RestController
@RequestMapping(produces = "application/json")
public class JupyterControler
{        
	JupyterApi japi= new JupyterApi();
    String username="totos";

    @RequestMapping(value = "/action/start", method = RequestMethod.GET)
    public RestResponse<Object> start(HttpSession session, @RequestParam(required = false) String error) 
    {
        if (error != null) {
      
            return RestResponse.error(null, error);
        }
        
        japi.api_request("info", "GET", null);
        japi.api_request("users", "GET", null);
		japi.api_request("users/"+username, "POST", null);
        
        //japi.api_request("authorizations/token", "POST", new HubUserCreate("totos", " "));
        japi.api_request("users/totos/server", "POST", null);

        Object target="http://192.168.10.163:8000/user/totos";
        
        
        return RestResponse.result(target);
    }
    
    @RequestMapping(value = "/action/servers", method = RequestMethod.GET)
    public RestResponse<Object> server_info(HttpSession session, @RequestParam(required = false) String error) 
    {
        if (error != null) {
      
            return RestResponse.error(null, error);
        }
        
        return RestResponse.result(japi.api_request("users/"+username, "GET", null));
    }

}