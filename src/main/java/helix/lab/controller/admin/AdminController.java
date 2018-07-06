package helix.lab.controller.admin;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import helix.lab.model.admin.HubServerEntity;
import helix.lab.model.admin.ServerRegistrationRequest;
import helix.lab.model.user.AccountToServerEntity;
import helix.lab.repository.HubServerRepository;
import helix.lab.service.JupyterApi;

/**
 * Actions for querying and updating admin data
 */
@RestController
@Secured({"ROLE_ADMIN"})
@RequestMapping(produces = "application/json")
public class AdminController extends BaseController{

	private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

	@Autowired
	HubServerRepository hsr;
	
	
	JupyterApi japi= new JupyterApi();

	/**
     * Instance of @{link org.springframework.validation.Validator} for performing user input validation manually.
     */
    @Autowired
    private org.springframework.validation.Validator validator;
    
    
	
	@RequestMapping(value = "action/admin/servers", method = RequestMethod.GET)
	public RestResponse<?> getServers() {

			List<HubServerEntity> hse = hsr.findAll();
			System.out.println(hse);
			return RestResponse.result(hse);
			//return RestResponse.error(BasicErrorCode.IO_ERROR, "An unknown error has occurred");
	   
	}
	
	@RequestMapping(value = "action/admin/users", method = RequestMethod.GET)
	public RestResponse<?> getUsers() {
			List<AccountEntity> accounts = aer.findAll();
			return RestResponse.result(accounts);
			//return RestResponse.error(BasicErrorCode.IO_ERROR, "An unknown error has occurred");
	   
	}
	
	@RequestMapping(value = "action/admin/users_to_servers", method = RequestMethod.GET)
	public RestResponse<?> getUsersToServers() {
			List<AccountToServerEntity> accounts_to_server = atsr.findAll();
			return RestResponse.result(accounts_to_server);
			//return RestResponse.error(BasicErrorCode.IO_ERROR, "An unknown error has occurred");
	   
	}
	
	@RequestMapping(value = "action/admin/grand_role/{user_id}", method = RequestMethod.PUT)
	public RestResponse<?> grand_role(Authentication Authentication, @PathVariable int user_id, @RequestBody EnumRole role,  BindingResult results) {
		System.out.println("................................................");
		System.out.println(role.toString());
	        try {
	        	//((OptionalValidatorFactoryBean) validator).validate(request, results);
	            
	            if (results.hasErrors()) {
	                
	                return RestResponse.error((Error) results.getFieldErrors());
	            }	           
	             Optional<AccountEntity> account =  aer.findById(user_id);
	             AccountEntity acc = account.get();
	             
	             acc.grant(role, aer.findById(currentUserId()).get());
	            return RestResponse.result(aer.save(acc));
	        } catch (Exception ex) {
	            logger.error(ex.getMessage(), ex);

	            return RestResponse.error((ErrorCode) ex,ex.getMessage());
	        }

	}
	
	@RequestMapping(value = "action/admin/revoke_role/{user_id}", method = RequestMethod.PUT)
	public RestResponse<?> revoke_role(Authentication Authentication, @PathVariable int user_id, @RequestBody EnumRole role,  BindingResult results) {
		System.out.println("................................................");
		System.out.println(role.toString());
	        try {
	        	//((OptionalValidatorFactoryBean) validator).validate(request, results);
	            
	            if (results.hasErrors()) {
	                
	                return RestResponse.error((Error) results.getFieldErrors());
	            }	           
	             Optional<AccountEntity> account =  aer.findById(user_id);
	             AccountEntity acc = account.get();
	             
	             acc.revoke(role);
	            return RestResponse.result(aer.save(acc));
	        } catch (Exception ex) {
	            logger.error(ex.getMessage(), ex);

	            return RestResponse.error((ErrorCode) ex,ex.getMessage());
	        }

	}
	
	
	@RequestMapping(value = "action/admin/add_server", method = RequestMethod.POST)
	public RestResponse<?> add_server(Authentication Authentication, @RequestBody ServerRegistrationRequest request,  BindingResult results) {
		System.out.println("................................................");
		System.out.println(request.toString());
	        try {
	        	//((OptionalValidatorFactoryBean) validator).validate(request, results);
	            
	            if (results.hasErrors()) {
	                
	                return RestResponse.error((Error) results.getFieldErrors());
	            }
	            HubServerEntity hse = new HubServerEntity(request);

	            // TODO Ping server 
	            japi.api_request(hse,"info", "GET", null);// get info about server //test
	            japi.api_request(hse,"users", "GET", null);// get all users of server db //test
	             //hsr.save(hse);
	            return RestResponse.result(hsr.save(hse));
	        } catch (Exception ex) {
	            logger.error(ex.getMessage(), ex);

	            return RestResponse.error((ErrorCode) ex,ex.getMessage());
	        }

	}
	
	
	@RequestMapping(value = "action/admin/edit_server/{server_id}", method = RequestMethod.POST)
	public RestResponse<?> edit_server(Authentication Authentication, @PathVariable int server_id, @RequestBody ServerRegistrationRequest request,  BindingResult results) {
		System.out.println("................................................");
		System.out.println(request.toString());
	        try {
	        	//((OptionalValidatorFactoryBean) validator).validate(request, results);
	            
	            if (results.hasErrors()) {
	                
	                return RestResponse.error((Error) results.getFieldErrors());
	            }	           
	             Optional<HubServerEntity> hse =  hsr.findById(server_id);
	            return RestResponse.result(hsr.save(hse.get()));
	        } catch (Exception ex) {
	            logger.error(ex.getMessage(), ex);

	            return RestResponse.error((ErrorCode) ex,ex.getMessage());
	        }

	}
	
	
}
