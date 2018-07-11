package helix.lab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(
    scanBasePackageClasses = {
        gr.helix.core.common.config._Marker.class,
        gr.helix.core.common.repository._Marker.class,
        gr.helix.core.common.service._Marker.class,
        helix.lab.config._Marker.class,
        helix.lab.repository._Marker.class,
        helix.lab.service._Marker.class,
        helix.lab.controller._Marker.class,
    }
)
@EntityScan(
    basePackageClasses = {
        gr.helix.core.common.domain._Marker.class,
        helix.lab.domain._Marker.class,
        helix.lab.model.user._Marker.class,
        helix.lab.model.admin._Marker.class,
    }
)
@EnableScheduling
public class Application extends SpringBootServletInitializer {

    /**
     * Used when packaging as a WAR application
     */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder)
    {
        return builder.sources(Application.class);
    }

    /**
     * Used when packaging as a standalone JAR (the server is embedded)
     */
    public static void main(String[] args)
    {
        SpringApplication.run(Application.class, args);
    }
}
