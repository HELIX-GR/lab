package gr.helix.lab.rpc.service;

import org.springframework.stereotype.Service;

import gr.helix.core.common.model.NotebookServerRequest;
import gr.helix.core.common.service.JupyterHubService;

@Service
public class DefaultJupyterHubService implements JupyterHubService
{

    @Override
    public boolean initializeNotebookServer(NotebookServerRequest request)
    {
        // TODO: Add initialization code ...

        return true;
    }

}
