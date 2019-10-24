package gr.helix.lab.web.config;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.remoting.httpinvoker.HttpInvokerProxyFactoryBean;

import gr.helix.core.common.service.UserDataManagementService;

@Configuration
public class RpcClientConfiguration
{
    private URI rootUrl;

    @Autowired
    private void setRootUrl(
        @Value("${helix.rpc-server.url}") String rootUrl
    ) {
        this.rootUrl = URI.create(rootUrl).normalize();
    }

    @Bean
    public HttpInvokerProxyFactoryBean userDataManagementServiceFactory() {
        final String serviceUrl = this.rootUrl.resolve("/userDataManagementService").toString();

        final HttpInvokerProxyFactoryBean factory = new HttpInvokerProxyFactoryBean();
        factory.setServiceInterface(UserDataManagementService.class);
        factory.setServiceUrl(serviceUrl);
        return factory;
    }

}