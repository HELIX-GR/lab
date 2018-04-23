package helix.lab.service;

import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service("defaultWebFileNamingStrategry")
public class DefaultWebFileNamingStrategry extends DefaultFileNamingStrategy implements WebFileNamingStrategy {

    @Value("/data/")
    private Path workflowDataDir;

    @Override
    public Path resolveExecutionPath(String relativePath) {
        return workflowDataDir.resolve(relativePath);
    }

}