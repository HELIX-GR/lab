package gr.helix.lab.web;

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
        gr.helix.lab.web.config._Marker.class,
        gr.helix.lab.web.repository._Marker.class,
        gr.helix.lab.web.service._Marker.class,
        gr.helix.lab.web.controller._Marker.class,
    }
)
@EntityScan(
    basePackageClasses = {
        gr.helix.core.common.domain._Marker.class,
        gr.helix.lab.web.domain._Marker.class,
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
