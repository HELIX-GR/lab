package gr.helix.lab.web.config;

import org.apache.http.client.HttpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;

import gr.helix.lab.web.service.CkanServiceProxy;

@Configuration
public class ServiceProxyConfiguration {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private HttpClient   httpClient;

    @Bean
    @ConfigurationProperties(prefix = "helix.ckan")
    ServiceConfiguration ckanConfiguration() {
        return new ServiceConfiguration();
    }

    @Bean
    CkanServiceProxy dataCkanServiceProxy(@Qualifier("ckanConfiguration") ServiceConfiguration configuration) {
        final CkanServiceProxy proxy = new CkanServiceProxy();

        proxy.setObjectMapper(this.objectMapper);
        proxy.setHttpClient(this.httpClient);
        proxy.setCkanConfiguration(configuration);

        return proxy;
    }

}
