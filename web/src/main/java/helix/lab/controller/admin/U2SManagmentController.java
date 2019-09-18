package helix.lab.controller.admin;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.model.RestResponse;
import helix.lab.controller.action.BaseController;
import helix.lab.domain.AccountToServerEntity;
import helix.lab.service.JupyterApi;

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
	
	@RequestMapping(value = "action/admin/close_u2s/{u2s_id}", method = RequestMethod.POST)
	public RestResponse<?> deleteUserToServer(@PathVariable int u2s_id) {
			JupyterApi japi= new JupyterApi();
			
			Optional<AccountToServerEntity> accounts_to_server = atsr.findById(u2s_id);
			AccountToServerEntity found= accounts_to_server.get();
			if (found!= null) {
				Boolean deleted = null;
				try {
					deleted = japi.delete_user_server(found.getHubServer(),found.getAccount().getUsername());
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				atsr.deleteById(u2s_id);
				return RestResponse.result(deleted);
			}
			
			
			
			
			
			return RestResponse.result("Not found");
	   
	}

	
}
