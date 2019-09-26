package gr.helix.lab.web.model.admin;

public class ClientAccountServer {

    private String       endpoint;

    private ClientServer server;

    public ClientAccountServer() {

    }

    public ClientAccountServer(String endpoint, ClientServer server) {
        this.endpoint = endpoint;
        this.server = server;
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

}
