package gr.helix.lab.userdata.rpc.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.remoting.httpinvoker.HttpInvokerServiceExporter;

import gr.helix.core.common.service.UserDataManagementService;

@Configuration
public class ServiceExporterConfiguration {

    @Bean(name = "/userDataManagementService")
    HttpInvokerServiceExporter echoServiceExporter(UserDataManagementService userDataManagementService) {
        final HttpInvokerServiceExporter exporter = new HttpInvokerServiceExporter();
        exporter.setServiceInterface(UserDataManagementService.class);
        exporter.setService(userDataManagementService);
        return exporter;
    }

}
