package gr.helix.lab.userdata.rpc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication(
    scanBasePackageClasses = {
        gr.helix.core.common.config._Marker.class,
        gr.helix.core.common.repository._Marker.class,
        gr.helix.core.common.service._Marker.class,
        gr.helix.lab.userdata.rpc.config._Marker.class,
        gr.helix.lab.userdata.rpc.service._Marker.class,
        gr.helix.lab.userdata.rpc.controller._Marker.class,
    }
)
@EntityScan(
    basePackageClasses = {
        gr.helix.core.common.domain._Marker.class,
    }
)
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
