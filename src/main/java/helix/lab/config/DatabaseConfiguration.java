package helix.lab.config;

import org.springframework.context.annotation.AdviceMode;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(
    basePackageClasses = {
        gr.helix.core.common.repository._Marker.class,
        helix.lab.repository._Marker.class,
    }
)
@EnableTransactionManagement(mode = AdviceMode.PROXY)
public class DatabaseConfiguration {

}