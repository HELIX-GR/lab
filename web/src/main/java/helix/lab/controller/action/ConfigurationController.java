package helix.lab.controller.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.saml.metadata.MetadataManager;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.model.RestResponse;
import helix.lab.config.SamlConfiguration;
import helix.lab.model.configuration.ClientConfiguration;
import helix.lab.service.CkanServiceProxy;

@RestController
@RequestMapping(produces = "application/json")
public class ConfigurationController extends BaseController {

    @Autowired
    private SamlConfiguration samlConfiguration;

    @Autowired
    private MetadataManager   metadata;

    @Autowired
    private CkanServiceProxy  ckanServiceProxy;

    @RequestMapping(value = "/action/configuration/{locale}", method = RequestMethod.GET)
    public RestResponse<ClientConfiguration> getConfiguration(String locale) {
        return RestResponse.result(this.createConfiguration());
    }

    private ClientConfiguration createConfiguration() {
        final ClientConfiguration config = new ClientConfiguration();

        config.setDefaultIdentityProvider(this.samlConfiguration.getDefaultProvider());
        config.setCkan(this.ckanServiceProxy.getMetadata());

        this.metadata.getIDPEntityNames().stream().forEach(config::addIdentityProvider);

        return config;
    }

}
