package helix.lab.controller.admin;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.model.RestResponse;
import helix.lab.controller.action.BaseController;
import helix.lab.model.user.AccountToServerEntity;

@RestController
@Secured({"ROLE_ADMIN"})
@RequestMapping(produces = "application/json")
public class U2SManagmentController  extends BaseController{
	private static final Logger logger = LoggerFactory.getLogger(U2SManagmentController.class);

	
	
	@RequestMapping(value = "action/admin/users_to_servers", method = RequestMethod.GET)
	public RestResponse<?> getUsersToServers() {
			List<AccountToServerEntity> accounts_to_server = atsr.findAll();
			return RestResponse.result(accounts_to_server);
			//return RestResponse.error(BasicErrorCode.IO_ERROR, "An unknown error has occurred");
	   
	}
	

	
}
