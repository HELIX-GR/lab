package gr.helix.lab.web.controller.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.utils.URIBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.model.ApplicationException;
import gr.helix.core.common.model.BasicErrorCode;
import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.model.NotebookServerRequest;
import gr.helix.core.common.model.RestResponse;
import gr.helix.core.common.repository.AccountRepository;
import gr.helix.core.common.service.JupyterHubService;
import gr.helix.lab.web.domain.AccountServerEntity;
import gr.helix.lab.web.domain.HubServerEntity;
import gr.helix.lab.web.model.admin.AdminErrorCode;
import gr.helix.lab.web.model.admin.ClientAccountServer;
import gr.helix.lab.web.model.admin.ClientServer;
import gr.helix.lab.web.model.hub.HubUserInfo;
import gr.helix.lab.web.repository.AccountServerRepository;
import gr.helix.lab.web.repository.HubServerRepository;
import gr.helix.lab.web.service.JupyterHubClient;

@RestController
@Secured({"ROLE_STANDARD", "ROLE_ADMIN"})
@RequestMapping(produces = "application/json")
public class HubController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(HubController.class);

    @Autowired
    AccountRepository           accountRepository;

    @Autowired
    AccountServerRepository     accountServerRepository;

    @Autowired
    HubServerRepository         hubServerRepository;

    @Autowired
    JupyterHubClient            jupyterHubClient;

    @Autowired
    JupyterHubService           jupyterHubService;

    @RequestMapping(value = "/action/server/start/{hubId}", method = RequestMethod.POST)
    public RestResponse<Object> startServer(@PathVariable int hubId) {
        try {
            final String username = this.currentUserName();

            // Check if server exists
            final Optional<HubServerEntity> hubServer = this.hubServerRepository.findById(hubId);
            if (!hubServer.isPresent()) {
                return RestResponse.error(AdminErrorCode.HUB_SERVER_NOT_FOUND, "Server was not found");
            }

            // Check if the user has permission to access this server
            final boolean isEligible = this.hasRole(hubServer.get().getEligibleRole());
            if (!isEligible) {
                return RestResponse.error(AdminErrorCode.HUB_SERVER_ACCESS_DENIED, "Cannot connect to this server");
            }

            // Compose user endpoint
            final String endpoint = hubServer.get().getUrl() + "/user/" + username;

            // Check if account is already registered to the server
            final List<AccountServerEntity> accountServers = this.accountServerRepository.findAllServersByUserId(this.currentUserId());

            if (!accountServers.isEmpty()) {
                final HubUserInfo hubUser = this.jupyterHubClient.getUserInfo(hubServer.get().getUrl(), hubServer.get().getToken(), username);

                // If the user is not registered to the Jupyter Hub server (e.g. the
                // administrator may have deleted the user manually) or the notebook
                // server is not running, delete record
                if (hubUser == null || StringUtils.isBlank(hubUser.getServer())) {
                    this.accountServerRepository.delete(accountServers.get(0));
                } else {
                    // Else return the endpoint of the existing registration
                    return RestResponse.result(endpoint);
                }
            }

            // Add user to the Jupyter Hub server user list
            HubUserInfo hubUser = null;

            try {
                hubUser = this.jupyterHubClient.getUserInfo(hubServer.get().getUrl(), hubServer.get().getToken(), username);
            } catch (final ApplicationException ex) {
                // Ignore exception
            }
            if(hubUser == null) {
                hubUser = this.jupyterHubClient.addUser(hubServer.get().getUrl(), hubServer.get().getToken(), username);
            }

            // Start notebook server if there is not already one running at the
            // specific Jupyter Hub instance
            if (StringUtils.isBlank(hubUser.getServer())) {
                final String dataDir = this.fileNamingStrategy.getUserDir(username, true).toString();
                final URIBuilder builder = new URIBuilder(hubServer.get().getUrl());

                final NotebookServerRequest initRequest = new NotebookServerRequest(builder.getHost(), username, dataDir);

                if(this.jupyterHubService.initializeNotebookServer(initRequest)) {
                    this.jupyterHubClient.startServer(hubServer.get().getUrl(), hubServer.get().getToken(), username);
                } else {
                    return RestResponse.error(AdminErrorCode.NOTEBOOK_SERVER_INIT_FAILURE, "Failed to initialize notebook server");
                }
            }

            // Create new server registration and add account to the Jupyter Hub
            // server user list
            final AccountEntity account = this.accountRepository.getOne(this.currentUserId());

            final AccountServerEntity accountServer = new AccountServerEntity();

            accountServer.setAccount(account);
            accountServer.setHubServer(hubServer.get());
            accountServer.setName(hubServer.get().getName());
            accountServer.setUrl(endpoint);
            accountServer.setState("Active");

            this.accountServerRepository.save(accountServer);

            return RestResponse.result(endpoint);
        } catch (final ApplicationException ex) {
            return RestResponse.error(ex.toError());
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);

            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

    @RequestMapping(value = "action/server/stop/{hubId}", method = RequestMethod.DELETE)
    public RestResponse<Void> stopServer(@PathVariable int hubId) {
        try {
            final String username = this.currentUserName();

            // Check if server exists
            final Optional<HubServerEntity> hubServer= this.hubServerRepository.findById(hubId);
            if (!hubServer.isPresent()) {
                return RestResponse.error(AdminErrorCode.HUB_SERVER_NOT_FOUND, "Server was not found");
            }

            // Stop notebook server
            this.jupyterHubClient.stopServer(hubServer.get().getUrl(), hubServer.get().getToken(), username);

            // Remove user from Jupyter Hub to prevent creating new notebook
            // servers without using lab application
            this.jupyterHubClient.removeUser(hubServer.get().getUrl(),  hubServer.get().getToken(), username);

            // Remove account to server registration
            final List<AccountServerEntity> accountServers = this.accountServerRepository.findAllServersByUserId(this.currentUserId());
            if (!accountServers.isEmpty()) {
                this.accountServerRepository.delete(accountServers.get(0));
            }
        } catch (final ApplicationException ex) {
            return RestResponse.error(ex.toError());
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);

            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }

        return RestResponse.success();
    }

    @RequestMapping(value = "action/user/servers", method = RequestMethod.GET)
    public RestResponse<?> getEligibleServers() {
        final List<ClientServer> records = new ArrayList<ClientServer>();

        for (final EnumRole role : this.getRoles()) {
            this.hubServerRepository.findAllByRole(role.toString()).stream()
                .map(s -> s.toDto())
                .forEach(records::add);
        }

        return RestResponse.result(records);
    }

    @RequestMapping(value = "/action/user/server", method = RequestMethod.GET)
    public RestResponse<?> getUserServer() {
        final List<AccountServerEntity> accountServers = this.accountServerRepository.findAllServersByUserId(this.currentUserId());

        if (!accountServers.isEmpty()) {
            final AccountServerEntity accountServer = accountServers.get(0);
            final HubServerEntity hubServer = accountServer.getHubServer();

            // Check if the user is registered to the Jupyter Hub server
            try {
                final HubUserInfo user = this.jupyterHubClient.getUserInfo(
                    hubServer.getUrl(), hubServer.getToken(), this.currentUserName()
                );

                // If user is not registered or the notebook server is not
                // running, delete the database record
                if (user == null || StringUtils.isBlank(user.getServer())) {
                    this.accountServerRepository.delete(accountServers.get(0));
                } else {
                    return RestResponse.result(new ClientAccountServer(accountServer.getUrl(), hubServer.toDto()));
                }
            } catch (final ApplicationException ex) {
                return RestResponse.error(ex.toError());
            } catch (final Exception ex) {
                // Ignore exception
            }
        }

        return RestResponse.result(null);
    }

}