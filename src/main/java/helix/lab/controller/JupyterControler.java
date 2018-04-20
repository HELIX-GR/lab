package helix.lab.controller;


import javax.servlet.http.HttpSession;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonProperty;

import helix.lab.HubUserCreate;
import helix.lab.model.RestResponse;
import helix.lab.service.JupyterApi;




@RestController
@RequestMapping(produces = "application/json")
public class JupyterControler
{

    private static class Token
    {
        private final CsrfToken token;

        public Token(CsrfToken token)
        {
            this.token = token;
        }

        @JsonProperty("csrfToken")
        public String getToken()
        {
            return token.getToken();
        }
    }


   

    @RequestMapping(value = "/action/start", method = RequestMethod.GET)
    public RestResponse<Object> login(HttpSession session, @RequestParam(required = false) String error) 
    {
        if (error != null) {
      
            return RestResponse.error(null, error);
        }
        
        JupyterApi japi= new JupyterApi();
        japi.api_request("info", "GET", null);
        japi.api_request("users", "GET", null);
        japi.api_request("users/totos", "POST", null);
        
        japi.api_request("authorizations/token", "POST", new HubUserCreate("totos", " "));
        japi.api_request("users/totos/server", "POST", null);

        Object target="http://192.168.10.163:8000/user/totos/lab";
        
        
        return RestResponse.result(target);
    }
    


}