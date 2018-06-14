package helix.lab.controller.admin;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.model.Error;
import gr.helix.core.common.model.ErrorCode;
import gr.helix.core.common.model.RestResponse;
import gr.helix.core.common.repository.AccountRepository;
import helix.lab.controller.action.BaseController;
import helix.lab.model.user.HubServerEntity;
import helix.lab.model.user.ServerRegistrationRequest;
import helix.lab.repository.HubServerRepository;

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
	
	@Autowired
	AccountRepository aer;
	
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
	             //hsr.save(hse);
	            return RestResponse.result(hsr.save(hse));
	        } catch (Exception ex) {
	            logger.error(ex.getMessage(), ex);

	            return RestResponse.error((ErrorCode) ex,ex.getMessage());
	        }


	}
	
	
	
	
}
