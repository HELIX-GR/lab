package gr.helix.lab.rpc.service;

import org.apache.tomcat.util.buf.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import gr.helix.core.common.model.NotebookServerRequest;
import gr.helix.core.common.service.JupyterHubService;

@Service
public class DefaultJupyterHubService implements JupyterHubService
{

    private static final Logger logger = LoggerFactory.getLogger(DefaultJupyterHubService.class);

    @Override
    public boolean initializeNotebookServer(NotebookServerRequest request)
    {
        // TODO: Add initialization code ...
        try {
            final CommandExecutor command = new CommandExecutor("pwd", 10000);

            final Integer exitCode = command.execute();

            if (exitCode == null) {
                logger.error("Command failed without an exit code");
            } else if (exitCode != 0) {
                logger.warn("Command failed. Exit Code : {}", exitCode);
            } else {
                logger.info("Command executed successfully. Exit Code : {}", exitCode);

                logger.info(StringUtils.join(command.getOutput()));

                return true;
            }
        } catch (final Exception ex) {
            logger.error("An unknown error has occurred", ex);
        }

        return false;
    }

}
