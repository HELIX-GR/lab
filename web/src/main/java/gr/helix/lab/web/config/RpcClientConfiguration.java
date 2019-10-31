package gr.helix.lab.web.config;

import java.net.URI;
import java.util.Arrays;

import org.apache.commons.codec.binary.Base64;
import org.apache.http.HttpHeaders;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.remoting.httpinvoker.HttpComponentsHttpInvokerRequestExecutor;
import org.springframework.remoting.httpinvoker.HttpInvokerProxyFactoryBean;

import gr.helix.core.common.service.UserDataManagementService;

@Configuration
public class RpcClientConfiguration
{
    private URI rootUrl;

    @Autowired
    private void setRootUrl(
        @Value("${helix.userdata.rpc-server.url}") String rootUrl) 
    {
        this.rootUrl = URI.create(rootUrl).normalize();
    }

    @Bean
    public CloseableHttpClient userDataManagementHttpClient(
        @Value("${helix.userdata.rpc-server.username}") String username, 
        @Value("${helix.userdata.rpc-server.password}") String password)
    {
        // Use preemptive authentication for this service (always the same user)
        BasicHeader authHeader = new BasicHeader(HttpHeaders.AUTHORIZATION, 
            "Basic " + Base64.encodeBase64String((username + ":" + password).getBytes())); 
        
        // Build the client and add default headers
        return HttpClients.custom()
            .setMaxConnTotal(100)
            .setMaxConnPerRoute(50)
            .setDefaultHeaders(Arrays.asList(authHeader))
            .build();
    }
    
    @Bean
    public HttpInvokerProxyFactoryBean userDataManagementServiceFactory(
        @Qualifier("userDataManagementHttpClient") CloseableHttpClient httpClient) 
    {
        final String serviceUrl = this.rootUrl.resolve("/userDataManagementService").toString();
        
        final HttpInvokerProxyFactoryBean invoker = new HttpInvokerProxyFactoryBean();
        invoker.setServiceInterface(UserDataManagementService.class);
        invoker.setServiceUrl(serviceUrl);
        invoker.setHttpInvokerRequestExecutor(new HttpComponentsHttpInvokerRequestExecutor(httpClient));
        return invoker;
    }

}