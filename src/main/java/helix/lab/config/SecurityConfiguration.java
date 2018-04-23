package helix.lab.config;


import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;


@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter
{
    
    @Override
    public void configure(WebSecurity security) throws Exception
    {
        security.ignoring()
            .antMatchers("/css/**", "/js/**", "/images/**", "vendor/**");
    }

    @Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		  auth.inMemoryAuthentication().withUser("totos").password("{noop}totos").roles("ADMIN");
		  auth.inMemoryAuthentication().withUser("ravan").password("{noop}ravan123").roles("USER");
		  auth.inMemoryAuthentication().withUser("kans").password("{noop}kans123").roles("USER");
	}
	

    @Override
    protected void configure(HttpSecurity security) throws Exception
    {
        // Authorize requests:
        // Which granted authorities must be present for each request?

        security.authorizeRequests()
            .antMatchers(
                    "/", "/index",
                    "/login", "/logged-out", "/filesystem","/action/**")
                .permitAll()
            .antMatchers(
                    "/logged-in", "/logout")
                .authenticated()
            .antMatchers(
                    "/admin/**")
                .hasAuthority("ROLE_ADMIN");

        // Support form-based login

        security.formLogin()
        	.loginPage("/login")
            .loginPage("/")
            .defaultSuccessUrl("/", true)
            .defaultSuccessUrl("/logged-in", true)
            .usernameParameter("username")
            .passwordParameter("password");

        security.logout()
            .logoutUrl("/logout")
            .logoutSuccessUrl("/logged-out")
            .invalidateHttpSession(true);

        // Configure CSRF

        security.csrf().requireCsrfProtectionMatcher((HttpServletRequest req) -> {
            String method = req.getMethod();
            String path = req.getServletPath();
            if (path.startsWith("/api/")) {
                return false; // exclude Rest API
            }
            if (method.equals("POST") || method.equals("PUT") || method.equals("DELETE")) {
                return true; // include all state-changing methods
            }
            return false;
         });


        // Do not redirect unauthenticated requests (just respond with a status code)

        security.exceptionHandling()
            .authenticationEntryPoint(
                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));
       

        


    }
}