package helix.lab.service;

import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service("defaultWebFileNamingStrategry")
public class DefaultWebFileNamingStrategry extends DefaultFileNamingStrategy implements WebFileNamingStrategy {

    @Value("#{T(java.nio.file.Paths).get('${slipo.rpc-server.workflows.data-dir}')}")
    private Path workflowDataDir;

    @Override
    public Path resolveExecutionPath(String relativePath) {
        return workflowDataDir.resolve(relativePath);
    }

}