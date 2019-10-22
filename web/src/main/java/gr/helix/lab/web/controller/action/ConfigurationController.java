package gr.helix.lab.web.controller.action;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.saml.metadata.MetadataManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.domain.HubKernelEntity;
import gr.helix.core.common.model.RestResponse;
import gr.helix.lab.web.config.SamlConfiguration;
import gr.helix.lab.web.model.EnumAuthProvider;
import gr.helix.lab.web.model.configuration.ClientConfiguration;
import gr.helix.lab.web.repository.HubKernelRepository;
import gr.helix.lab.web.service.CkanServiceProxy;

@RestController
@RequestMapping(produces = "application/json")
public class ConfigurationController extends BaseController {

    @Value("${helix.authentication-providers:forms}")
    private String              authProviders;

    @Autowired
    private SamlConfiguration   samlConfiguration;

    @Autowired
    private MetadataManager     metadata;

    @Autowired
    private CkanServiceProxy    ckanServiceProxy;

    @Autowired
    private HubKernelRepository hubKernelRepository;

    @GetMapping(value = "/action/configuration/{locale}")
    public RestResponse<ClientConfiguration> getConfiguration(String locale) {
        return RestResponse.result(this.createConfiguration());
    }

    private ClientConfiguration createConfiguration() {
        final ClientConfiguration config = new ClientConfiguration();

        config.setDefaultIdentityProvider(this.samlConfiguration.getDefaultProvider());
        config.setCkan(this.ckanServiceProxy.getMetadata());

        Arrays.stream(this.authProviders.split(","))
            .map(String::trim)
            .map(EnumAuthProvider::fromString)
            .filter(s -> s != null)
            .forEach(s -> config.getAuthProviders().add(s));

        this.metadata.getIDPEntityNames().stream().forEach(config::addIdentityProvider);

        this.hubKernelRepository.findAll().stream()
            .map(HubKernelEntity::toDto)
            .forEach(k -> config.getKernels().add(k));

        return config;
    }

}
