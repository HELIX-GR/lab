package helix.lab.controller.admin;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.model.Error;
import gr.helix.core.common.model.ErrorCode;
import gr.helix.core.common.model.RestResponse;
import helix.lab.controller.action.BaseController;
import helix.lab.domain.AccountWhiteListEntry;
import helix.lab.model.admin.AccountWhiteListInfo;

@RestController
@Secured({"ROLE_ADMIN"})
@RequestMapping(produces = "application/json")
public class WhiteListController extends BaseController{

	private static final Logger logger = LoggerFactory.getLogger(AdminController.class);


	
	
	//----------------------- Whitelist--------------------------
	@RequestMapping(value = "action/admin/white_list/users", method = RequestMethod.GET)
	public RestResponse<?> getWhiteListUsers() {
			List<AccountWhiteListEntry> accounts = awlr.findAll();
			return RestResponse.result(accounts);
			//return RestResponse.error(BasicErrorCode.IO_ERROR, "An unknown error has occurred");
	   
	}
		
    /**
     * Adds a user to the white list.
     *
     * @param user the currently authenticated user.
     * @param userInfo the user to add.
     * @return the controller's response.
     */
    @RequestMapping(value = "/action/admin/white_list/create", method = RequestMethod.POST)
    public RestResponse<Void> addUserToWhiteList(Authentication Authentication,@RequestBody AccountWhiteListInfo userInfo, BindingResult results) {
        try { 
        	if (results.hasErrors()) {
        		return RestResponse.error((Error) results.getFieldErrors());
        	}	    
        	AccountEntity alreadyJoined = aer.findOneByEmail(userInfo.getEmail());
        	if (alreadyJoined!= null) {
        		for (EnumRole e : userInfo.getRoles()){
        			alreadyJoined.grant(e, aer.findById(currentUserId()).get());
        		}
        		aer.save(alreadyJoined);
        	}else {
        		AccountWhiteListEntry newWLacc= new AccountWhiteListEntry(userInfo.getEmail());
        		for (EnumRole e : userInfo.getRoles()){
        			newWLacc.grant(e, aer.findById(currentUserId()).get());
        		}
        		awlr.save(newWLacc);
        	}
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);

            return RestResponse.error((ErrorCode) ex,ex.getMessage());
        }

        return RestResponse.success();
    }

	
	
	@RequestMapping(value = "action/admin/white_list/grand_role/{user_id}", method = RequestMethod.PUT)
	public RestResponse<?> grandWhiteListRole(Authentication Authentication, @PathVariable int user_id, @RequestBody EnumRole role,  BindingResult results) {
		System.out.println("................................................");
		System.out.println(role.toString());
	        try {
	        	//((OptionalValidatorFactoryBean) validator).validate(request, results);
	            
	            if (results.hasErrors()) {
	                
	                return RestResponse.error((Error) results.getFieldErrors());
	            }	           
	             Optional<AccountWhiteListEntry> account =  awlr.findById(user_id);
	             AccountWhiteListEntry acc = account.get();
	             
	             acc.grant(role, aer.findById(currentUserId()).get());
	            return RestResponse.result(awlr.save(acc));
	        } catch (Exception ex) {
	            logger.error(ex.getMessage(), ex);

	            return RestResponse.error((ErrorCode) ex,ex.getMessage());
	        }

	}
	
	@RequestMapping(value = "action/admin/white_list/revoke_role/{user_id}", method = RequestMethod.PUT)
	public RestResponse<?> revokeWhiteListRole(Authentication Authentication, @PathVariable int user_id, @RequestBody EnumRole role,  BindingResult results) {
	
	        try {
	            if (results.hasErrors()) {
	                
	                return RestResponse.error((Error) results.getFieldErrors());
	            }	           
	             Optional<AccountWhiteListEntry> account =  awlr.findById(user_id);
	             AccountWhiteListEntry acc = account.get();
	             
	             acc.revoke(role);
	            return RestResponse.result(awlr.save(acc));
	        } catch (Exception ex) {
	            logger.error(ex.getMessage(), ex);

	            return RestResponse.error((ErrorCode) ex,ex.getMessage());
	        }

	}
}
