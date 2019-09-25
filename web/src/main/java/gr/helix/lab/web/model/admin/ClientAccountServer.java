package gr.helix.lab.web.model.admin;

public class ClientAccountServer {

    private String       target;

    private ClientServer server;

    public ClientAccountServer() {

    }

    public ClientAccountServer(String target, ClientServer server) {
        this.target = target;
        this.server = server;
    }

    public String getTarget() {
        return this.target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public ClientServer getServer() {
        return this.server;
    }

    public void setServer(ClientServer server) {
        this.server = server;
    }

}
