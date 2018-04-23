package helix.lab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;


@SpringBootApplication(
	    scanBasePackageClasses = {
	        helix.lab.config._Marker.class,
	        helix.lab.service._Marker.class,
	        helix.lab.model._Marker.class,
	    }
	    ) 
@EnableGlobalMethodSecurity(securedEnabled = true)
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}


