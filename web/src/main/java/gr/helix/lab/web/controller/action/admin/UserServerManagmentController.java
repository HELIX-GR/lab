package gr.helix.lab.web.controller.action.admin;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.model.ApplicationException;
import gr.helix.core.common.model.RestResponse;
import gr.helix.lab.web.controller.action.BaseController;
import gr.helix.lab.web.domain.AccountServerEntity;
import gr.helix.lab.web.domain.HubServerEntity;
import gr.helix.lab.web.model.admin.AdminErrorCode;
import gr.helix.lab.web.model.admin.ClientServerRegistration;
import gr.helix.lab.web.model.hub.HubUserInfo;
import gr.helix.lab.web.repository.AccountServerRepository;
import gr.helix.lab.web.service.JupyterHubClient;

@RestController
@Secured({"ROLE_ADMIN"})
@RequestMapping(produces = "application/json")
public class UserServerManagmentController extends BaseController {

    @Autowired
    AccountServerRepository accountServerRepository;

    @Autowired
    JupyterHubClient        jupyterHubClient;

    @GetMapping(value = "action/admin/servers/activity")
    public RestResponse<?> getUserServers() {
        final List<ClientServerRegistration> accountServers = this.accountServerRepository.findAll().stream()
            .map(AccountServerEntity::toDto)
            .collect(Collectors.toList());

        return RestResponse.result(accountServers);
    }

    @DeleteMapping(value = "action/admin/server/registration/{regId}")
    public RestResponse<?> deleteUserServer(@PathVariable int regId) {
        // Check if registration exists
        final AccountServerEntity accountServer = this.accountServerRepository.findById(regId).orElse(null);

        if (accountServer == null) {
            return RestResponse.error(AdminErrorCode.REGISRATION_NOT_FOUND, "Account server registration was not found");
        }

        boolean result = false;

        try {
            final AccountEntity account = accountServer.getAccount();
            final HubServerEntity server = accountServer.getHubServer();

            // Create client context
            final JupyterHubClient.Context ctx = new JupyterHubClient.Context(
                server.getUrl(),
                server.getToken(),
                account.getUsername()
            );


            final HubUserInfo userInfo = this.jupyterHubClient.getUserInfo(ctx);

            // Stop existing notebook server
            if (!StringUtils.isBlank(userInfo.getServer())) {
                this.jupyterHubClient.stopServer(ctx);
            }

            if (!userInfo.isAdmin()) {
                // Remove user from all groups
                this.jupyterHubClient.removeUserFromGroups(ctx, userInfo.getGroups());

                // Remove user from Jupyter Hub to prevent creating new notebook
                // servers without using lab application
                result = this.jupyterHubClient.removeUser(ctx);
            } else {
                result = true;
            }
        } catch (final ApplicationException ex) {
            return RestResponse.error(ex.toError());
        }

        // Remove registration
        this.accountServerRepository.deleteById(regId);

        return RestResponse.result(result);
    }

}
