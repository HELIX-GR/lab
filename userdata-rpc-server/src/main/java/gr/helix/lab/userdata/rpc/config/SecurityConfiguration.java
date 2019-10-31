package gr.helix.lab.userdata.rpc.config;

import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter
{    
    private static final Pattern CIDR_NETWORK_PATTERN = 
        Pattern.compile("(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})/(\\d{1,2})");
    
    @Value("${helix.userdata.security.client.remote-addresses:127.0.0.1/8}")
    private String[] clientAddresses; 
    
    @PostConstruct
    private void checkClientAddresses()
    {
        for (String r: this.clientAddresses) {
            Matcher matcher = CIDR_NETWORK_PATTERN.matcher(r);
            if (!matcher.matches() || Integer.parseUnsignedInt(matcher.group(2)) > 32) {
                throw new IllegalStateException("address is not a CIDR network: " + r);
            }
        }
    }
    
    @Override
    protected void configure(HttpSecurity security) throws Exception
    {
        security.sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.NEVER);
        
        security.csrf()
            .disable();
        
        security.httpBasic()
            .realmName("User-Data RPC Service");
        
        final String clientAccessExpression = "hasAuthority('ROLE_CLIENT') and " +
            Arrays.stream(clientAddresses).map(r -> "hasIpAddress(" + "'" + r + "'" + ")")
                .collect(Collectors.joining(" or ", "(", ")"));
        
        security.authorizeRequests()
            .antMatchers("/userDataManagementService")
                .access(clientAccessExpression)
            .antMatchers("/userDataManagement/*")
                .access(clientAccessExpression)
            .antMatchers("/**")
                .authenticated();
    }
}
