package gr.helix.lab.web.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ServiceProxyConfiguration {

  
    @Bean
    @ConfigurationProperties(prefix = "helix.ckan")
    ServiceConfiguration ckanConfiguration() {
        return new ServiceConfiguration();
    }

}
