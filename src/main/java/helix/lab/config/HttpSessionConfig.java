package helix.lab.config;

import org.springframework.context.annotation.Profile;
import org.springframework.session.MapSessionRepository;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;

@Profile({ "production", "development" })
@EnableJdbcHttpSession(tableName = "web.spring_session")
public class HttpSessionConfig {

    //@Bean
    public MapSessionRepository sessionRepository() {
        return new MapSessionRepository();
    }

}
