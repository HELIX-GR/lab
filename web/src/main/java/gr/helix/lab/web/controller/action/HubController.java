package gr.helix.lab.web.controller.action;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.utils.URIBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.domain.HubKernelEntity;
import gr.helix.core.common.model.ApplicationException;
import gr.helix.core.common.model.BasicErrorCode;
import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.model.RestResponse;
import gr.helix.core.common.model.user.Account;
import gr.helix.core.common.model.user.AccountInfo;
import gr.helix.core.common.repository.AccountRepository;
import gr.helix.core.common.service.UserDataManagementService;
import gr.helix.lab.web.domain.AccountServerEntity;
import gr.helix.lab.web.domain.HubServerEntity;
import gr.helix.lab.web.model.admin.AdminErrorCode;
import gr.helix.lab.web.model.admin.ClientAccountServer;
import gr.helix.lab.web.model.admin.ClientServer;
import gr.helix.lab.web.model.hub.HubUserInfo;
import gr.helix.lab.web.repository.AccountServerRepository;
import gr.helix.lab.web.repository.HubKernelRepository;
import gr.helix.lab.web.repository.HubServerRepository;
import gr.helix.lab.web.service.JupyterHubClient;

@RestController
@Secured({"ROLE_STANDARD", "ROLE_ADMIN"})
@RequestMapping(produces = "application/json")
public class HubController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(HubController.class);
    
    @Value("${helix.rpc-server.enabled}")
    boolean                     isRpcServerEnabled;
    
    @Autowired
    AccountRepository           accountRepository;

    @Autowired
    AccountServerRepository     accountServerRepository;

    @Autowired
    HubServerRepository         hubServerRepository;

    @Autowired
    HubKernelRepository         hubKernelRepository;

    @Autowired
    JupyterHubClient            jupyterHubClient;

    @Autowired
    UserDataManagementService           jupyterHubService;

    Long                        quotaForSpace = null; /* use defaults */
    
    Long                        quotaForNumberOfFiles = null; /* use defaults */
    
    @PostMapping(value = "/action/server/start/{hubId}/{kernel}")
    public RestResponse<Object> startServer(@PathVariable int hubId, @PathVariable String kernel) {
        try {
            final String username = this.currentUserName();

            // Check if server exists
            final HubServerEntity hubServer = this.hubServerRepository.findById(hubId).orElse(null);
            if (hubServer == null) {
                return RestResponse.error(AdminErrorCode.HUB_SERVER_NOT_FOUND, "Server was not found");
            }

            // Check if kernel exists
            final HubKernelEntity hubKernel = this.hubKernelRepository.findByName(kernel).orElse(null);
            if (hubKernel == null) {
                return RestResponse.error(AdminErrorCode.HUB_KERNEL_NOT_FOUND, "Kernel was not found");
            }

            // Check if server supports the selected kernel
            if (!hubServer.hasKernel(kernel)) {
                return RestResponse.error(AdminErrorCode.HUB_KERNEL_NOT_SUPPORTED, "Kernel is not supported");
            }

            // Check if the user has permission to access this server
            final boolean isEligible = this.hasRole(hubServer.getEligibleRole());
            if (!isEligible) {
                return RestResponse.error(AdminErrorCode.HUB_SERVER_ACCESS_DENIED, "Cannot connect to this server");
            }

            // Check if the user has permission to access the selected kernel
            if(!this.currentUser().getAccount().hasKernel(kernel)) {
                return RestResponse.error(AdminErrorCode.HUB_KERNEL_ACCESS_DENIED, "Cannot start this kernel");
            }

            // Compose user endpoint and client context
            final String endpoint = hubServer.getUrl() + "/user/" + username;

            final JupyterHubClient.Context ctx = new JupyterHubClient.Context(
                hubServer.getUrl(),
                hubServer.getToken(),
                username
            );

            // Remove existing server registration
            final List<AccountServerEntity> accountServers = this.accountServerRepository.findAllServersByUserId(this.currentUserId());
            if (!accountServers.isEmpty()) {
                this.accountServerRepository.delete(accountServers.get(0));
            }

            // Add user to the Jupyter Hub server and update groups
            HubUserInfo hubUser = null;

            // Get (and optionally create user)
            try {
                hubUser = this.jupyterHubClient.getUserInfo(ctx);
            } catch (final ApplicationException ex) {
                // Ignore exception
                logger.info("User {} does not exists on server {}. A new user will be created", username, hubServer.getName());
            }
            if(hubUser == null) {
                hubUser = this.jupyterHubClient.addUser(ctx);
            }
            // Set groups
            boolean removeSuccess = true;
            if (!hubUser.getGroups().isEmpty()) {
                removeSuccess = this.jupyterHubClient.removeUserFromGroups(ctx, hubUser.getGroups());
            }

            final boolean addSuccess = this.jupyterHubClient.addUserToGroup(ctx, kernel);

            if(!removeSuccess || !addSuccess) {
                return RestResponse.error(AdminErrorCode.HUB_USER_INIT_FAILED, "Cannot set user groups");
            }

            // Stop existing notebook server
            if (!StringUtils.isBlank(hubUser.getServer())) {
                this.jupyterHubClient.stopServer(ctx);
            }

            final URIBuilder builder = new URIBuilder(hubServer.getUrl());

            if (this.isRpcServerEnabled) {
                final AccountInfo accountInfo = new AccountInfo(currentUserId(), currentUserName());
                if (!this.jupyterHubService.setupDirs(accountInfo, builder.getHost(), quotaForSpace, quotaForNumberOfFiles)) {
                    return RestResponse.error(AdminErrorCode.NOTEBOOK_SERVER_INIT_FAILURE, "Failed to setup user directory!");
                }
            }

            this.jupyterHubClient.startServer(ctx);

            // Create new server registration and add account to the Jupyter Hub
            // server user list
            final AccountEntity account = this.accountRepository.getOne(this.currentUserId());

            final AccountServerEntity accountServer = new AccountServerEntity();

            accountServer.setAccount(account);
            accountServer.setHubServer(hubServer);
            accountServer.setName(hubServer.getName());
            accountServer.setUrl(endpoint);
            accountServer.setKernel(hubKernel);
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

    @DeleteMapping(value = "action/server/stop/{hubId}")
    public RestResponse<Void> stopServer(@PathVariable int hubId) {
        try {
            final String userName = this.currentUserName();

            // Check if server exists
            final HubServerEntity hubServer = this.hubServerRepository.findById(hubId).orElse(null);
            if (hubServer == null) {
                return RestResponse.error(AdminErrorCode.HUB_SERVER_NOT_FOUND, "Server was not found");
            }

            // Create client context
            final JupyterHubClient.Context ctx = new JupyterHubClient.Context(
                hubServer.getUrl(),
                hubServer.getToken(),
                userName
            );

            // Get user
            final HubUserInfo userInfo = this.jupyterHubClient.getUserInfo(ctx);

            // Stop notebook server
            if (!StringUtils.isBlank(userInfo.getServer())) {
                this.jupyterHubClient.stopServer(ctx);
            }

            if(!userInfo.isAdmin()) {
                // NOTE: Do not delete Jupyter Hub users. Instead reset their groups

                // Remove user from Jupyter Hub to prevent creating new notebook
                // servers without using lab application
                // this.jupyterHubClient.removeUser(hubServer.get().getUrl(),  hubServer.get().getToken(), userName);

                this.jupyterHubClient.removeUserFromGroups(ctx, userInfo.getGroups());
            }

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

    @GetMapping(value = "action/user/servers")
    public RestResponse<?> getEligibleServers() {
        final Account account = this.accountRepository.findById(this.currentUserId()).get().toDto();
        final List<ClientServer> records = new ArrayList<ClientServer>();

        for (final EnumRole role : this.getRoles()) {
            this.hubServerRepository.findAllByRole(role.toString()).stream()
                .map(e -> {
                    final ClientServer s = e.toDto();

                    // Remove kernels that are not assigned to the user
                    final List<String> allowedKernels = s.getKernels().stream()
                        .filter(account.getKernels()::contains)
                        .collect(Collectors.toList());
                    s.setKernels(allowedKernels);

                    return s;
                })
                .filter(s -> !s.getKernels().isEmpty())
                .forEach(records::add);
        }

        return RestResponse.result(records);
    }

    @GetMapping(value = "/action/user/server")
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
                    return RestResponse.result(
                        new ClientAccountServer(accountServer.getUrl(), hubServer.toDto(), accountServer.getKernel().toDto())
                    );
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