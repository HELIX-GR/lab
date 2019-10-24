package gr.helix.lab.userdata.rpc.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.remoting.httpinvoker.HttpInvokerServiceExporter;

import gr.helix.core.common.service.UserDataManagementService;

@Configuration
public class ServiceExporterConfiguration {

    @Bean(name = "/jupyter-hub-service")
    HttpInvokerServiceExporter echoServiceExporter(
        @Qualifier("defaultJupyterHubService") UserDataManagementService echoService
    ) {
        final HttpInvokerServiceExporter exporter = new HttpInvokerServiceExporter();
        exporter.setServiceInterface(UserDataManagementService.class);
        exporter.setService(echoService);
        return exporter;
    }

}
