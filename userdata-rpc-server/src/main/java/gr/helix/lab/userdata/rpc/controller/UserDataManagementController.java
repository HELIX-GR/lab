package gr.helix.lab.userdata.rpc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.model.RestResponse;
import gr.helix.core.common.service.UserDataManagementService;

@RestController
public class UserDataManagementController
{
    @Autowired
    private UserDataManagementService userDataManagementService;
    
    @GetMapping("/userDataManagement/listAccounts")
    public RestResponse<?> listAccounts() 
        throws Exception
    {
        return RestResponse.result(userDataManagementService.listAccounts(null));
    }
    
    @GetMapping("/userDataManagement/getReport")
    public RestResponse<?> getReport(
        @RequestParam("accountId") int accountId) throws Exception
    {
        return RestResponse.result(userDataManagementService.getReport(accountId, null).orElse(null));
    }
}
