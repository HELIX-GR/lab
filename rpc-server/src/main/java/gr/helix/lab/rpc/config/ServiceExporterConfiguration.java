package gr.helix.lab.rpc.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.remoting.httpinvoker.HttpInvokerServiceExporter;

import gr.helix.core.common.service.JupyterHubService;

@Configuration
public class ServiceExporterConfiguration {

    @Bean(name = "/jupyter-hub-service")
    HttpInvokerServiceExporter echoServiceExporter(
        @Qualifier("defaultJupyterHubService") JupyterHubService echoService
    ) {
        final HttpInvokerServiceExporter exporter = new HttpInvokerServiceExporter();
        exporter.setServiceInterface(JupyterHubService.class);
        exporter.setService(echoService);
        return exporter;
    }

}
