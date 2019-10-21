package gr.helix.lab.web.model.admin;

import gr.helix.core.common.model.user.ClientKernel;

public class ClientAccountServer {

    private String       endpoint;

    private ClientServer server;

    private ClientKernel kernel;

    public ClientAccountServer() {

    }

    public ClientAccountServer(String endpoint, ClientServer server, ClientKernel kernel) {
        this.endpoint = endpoint;
        this.server = server;
        this.kernel = kernel;
    }

    public String getEndpoint() {
        return this.endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public ClientServer getServer() {
        return this.server;
    }

    public void setServer(ClientServer server) {
        this.server = server;
    }

    public ClientKernel getKernel() {
        return this.kernel;
    }

    public void setKernel(ClientKernel kernel) {
        this.kernel = kernel;
    }

}
