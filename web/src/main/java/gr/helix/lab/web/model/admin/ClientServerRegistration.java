package gr.helix.lab.web.model.admin;

import java.time.ZonedDateTime;

import gr.helix.core.common.model.user.Account;

public class ClientServerRegistration {

    private Integer       id;

    private String        name;

    private Account       account;

    private ClientServer  server;

    private String        url;

    private ZonedDateTime startedAt;

    private String        state;

    private String        kernel;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Account getAccount() {
        return this.account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public ClientServer getServer() {
        return this.server;
    }

    public void setServer(ClientServer server) {
        this.server = server;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public ZonedDateTime getStartedAt() {
        return this.startedAt;
    }

    public void setStartedAt(ZonedDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public String getState() {
        return this.state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getKernel() {
        return this.kernel;
    }

    public void setKernel(String kernel) {
        this.kernel = kernel;
    }

}
