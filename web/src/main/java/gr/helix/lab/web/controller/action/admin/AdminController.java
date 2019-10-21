package gr.helix.lab.web.controller.action.admin;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.domain.HubKernelEntity;
import gr.helix.core.common.model.ApplicationException;
import gr.helix.core.common.model.BasicErrorCode;
import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.model.RestResponse;
import gr.helix.core.common.model.user.Account;
import gr.helix.core.common.repository.AccountRepository;
import gr.helix.lab.web.controller.action.BaseController;
import gr.helix.lab.web.domain.HubServerEntity;
import gr.helix.lab.web.domain.HubServerKernelEntity;
import gr.helix.lab.web.model.admin.AdminErrorCode;
import gr.helix.lab.web.model.admin.ClientServer;
import gr.helix.lab.web.model.admin.ClientServerRegistrationRequest;
import gr.helix.lab.web.repository.HubKernelRepository;
import gr.helix.lab.web.repository.HubServerRepository;
import gr.helix.lab.web.service.JupyterHubClient;

@RestController
@Secured({"ROLE_ADMIN"})
@RequestMapping(produces = "application/json")
public class AdminController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    AccountRepository           accountRepository;

    @Autowired
    HubServerRepository         hubServerRepository;

    @Autowired
    HubKernelRepository         hubKernelRepository;

    @Autowired
    JupyterHubClient            jupyterHubClient;

    @RequestMapping(value = "action/admin/servers", method = RequestMethod.GET)
    public RestResponse<?> getServers() {
        final List<ClientServer> servers = this.hubServerRepository.findAll().stream()
            .map(s -> s.toDto())
            .collect(Collectors.toList());

        return RestResponse.result(servers);
    }

    @RequestMapping(value = "action/admin/users", method = RequestMethod.GET)
    public RestResponse<?> getUsers() {
        final List<Account> accounts = this.accountRepository.findAll().stream()
            .map(a -> a.toDto())
            .collect(Collectors.toList());

        return RestResponse.result(accounts);
    }

    @RequestMapping(value = "action/admin/user/{userId}/role/{role}", method = RequestMethod.POST)
    public RestResponse<?> grantUserRole(@PathVariable int userId, @PathVariable EnumRole role) {
        final AccountEntity account = this.accountRepository.findById(userId).orElse(null);
        if (account == null) {
            return RestResponse.error(AdminErrorCode.ACCOUNT_NOT_FOUND, "Account was not found");
        }

        final AccountEntity grantedBy = this.accountRepository.findById(this.currentUserId()).orElse(null);

        account.grant(role, grantedBy);

        this.accountRepository.save(account);

        return RestResponse.result(account.toDto());
    }

    @RequestMapping(value = "action/admin/user/{userId}/role/{role}", method = RequestMethod.DELETE)
    public RestResponse<?> revokeUserRole(@PathVariable int userId, @PathVariable EnumRole role) {
        final AccountEntity account = this.accountRepository.findById(userId).orElse(null);
        if (account == null) {
            return RestResponse.error(AdminErrorCode.ACCOUNT_NOT_FOUND, "Account was not found");
        }

        // Do not remove the default role
        if (role != EnumRole.ROLE_USER) {
            account.revoke(role);

            this.accountRepository.save(account);
        }

        return RestResponse.result(account.toDto());
    }

    @RequestMapping(value = "action/admin/server", method = RequestMethod.POST)
    public RestResponse<?> addServer(@RequestBody @Valid ClientServerRegistrationRequest request, BindingResult results) {
        try {
            // Validate request data
            if (results.hasErrors()) {
                return RestResponse.invalid(results.getFieldErrors());
            }

            // Check server status
            this.jupyterHubClient.getHubStatus(request.getUrl(), request.getToken());

            // Create server
            final HubServerEntity server = new HubServerEntity(request);
            this.hubServerRepository.saveAndFlush(server);

            // Update kernels
            for (final String name : request.getKernels()) {
                final Optional<HubKernelEntity> kernel = this.hubKernelRepository.findByName(name);
                // Ignore invalid kernel names
                if (kernel.isPresent()) {
                    final HubServerKernelEntity serverKernel = new HubServerKernelEntity();
                    serverKernel.setKernel(kernel.get());
                    serverKernel.setServer(server);

                    server.getKernels().add(serverKernel);
                }
            }

            // Save kernels
            this.hubServerRepository.saveAndFlush(server);

            return RestResponse.result(server.toDto());
        } catch (final ApplicationException ex) {
            return RestResponse.error(ex.toError());
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);

            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

    @RequestMapping(value = "action/admin/server/{serverId}", method = RequestMethod.POST)
    public RestResponse<?> updateServer(
        @PathVariable int serverId, @RequestBody @Valid ClientServerRegistrationRequest request, BindingResult results
    ) {
        try {
            // Validate request data
            if (results.hasErrors()) {
                return RestResponse.invalid(results.getFieldErrors());
            }

            final Optional<HubServerEntity> server = this.hubServerRepository.findById(serverId);
            if(!server.isPresent()) {
                return RestResponse.error(AdminErrorCode.HUB_SERVER_NOT_FOUND, "Server was not found");
            }

            // Check server status
            this.jupyterHubClient.getHubStatus(request.getUrl(), request.getToken());

            server.get().update(request);

            this.hubServerRepository.save(server.get());

            // Delete existing kernels
            server.get().getKernels().clear();
            this.hubServerRepository.save(server.get());

            // Add new kernels
            for (final String name : request.getKernels()) {
                final Optional<HubKernelEntity> kernel = this.hubKernelRepository.findByName(name);
                // Ignore invalid kernel names
                if (kernel.isPresent()) {
                    final HubServerKernelEntity serverKernel = new HubServerKernelEntity();
                    serverKernel.setKernel(kernel.get());
                    serverKernel.setServer(server.get());

                    server.get().getKernels().add(serverKernel);
                }
            }

            // Save kernels
            this.hubServerRepository.save(server.get());

            return RestResponse.result(server.get().toDto());
        } catch (final ApplicationException ex) {
            return RestResponse.error(ex.toError());
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);

            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

    @RequestMapping(value = "action/admin/user/{userId}", method = RequestMethod.POST)
    public RestResponse<?> updateUser(
        @PathVariable int userId, @RequestBody @Valid Account request, BindingResult results
    ) {
        try {
            // Validate request data
            if (results.hasErrors()) {
                return RestResponse.invalid(results.getFieldErrors());
            }

            // Get authenticated account
            final AccountEntity grantedBy = this.accountRepository.findById(this.currentUserId()).orElse(null);

            // Get user
            final AccountEntity user = this.accountRepository.findById(userId).orElse(null);
            if(user == null) {
                return RestResponse.error(AdminErrorCode.ACCOUNT_NOT_FOUND, "Account was not found");
            }

            // Delete existing roles
            for(final EnumRole role : user.getRoles()) {
                // Do not remove default role
                if (role == EnumRole.ROLE_USER) {
                    continue;
                }
                // An administrator cannot remove his own role
                if (role == EnumRole.ROLE_ADMIN && userId == this.currentUserId()) {
                    continue;
                }
                user.revoke(role);
            }
            this.accountRepository.save(user);

            // Delete existing kernels
            user.getKernels().clear();
            this.accountRepository.save(user);

            // Add new roles
            for (final EnumRole role : request.getRoles()) {
                if (!user.hasRole(role)) {
                    user.grant(role, grantedBy);
                }
            }

            // Add new kernels
            for (final String name : request.getKernels()) {
                final Optional<HubKernelEntity> kernel = this.hubKernelRepository.findByName(name);
                // Ignore invalid kernel names
                if (kernel.isPresent()) {
                    user.grantKernel(kernel.get(), grantedBy);
                }
            }

            // Save kernels
            this.accountRepository.save(user);

            return RestResponse.result(user.toDto());
        } catch (final ApplicationException ex) {
            return RestResponse.error(ex.toError());
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);

            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

}
