package gr.helix.lab.web.model.hub;

import java.time.ZonedDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

public class HubUserInfo {

    String        kind;

    String        name;

    boolean       admin;

    List<String>  groups;

    /**
     * The user's notebook server's base URL, if running; null if not
     */
    String        server;

    String        pending;

    ZonedDateTime lastActivity;

    JsonNode      servers;

    public String getKind() {
        return this.kind;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isAdmin() {
        return this.admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public List<String> getGroups() {
        return this.groups;
    }

    public void setGroups(List<String> groups) {
        this.groups = groups;
    }

    public String getServer() {
        return this.server;
    }

    public void setServer(String server) {
        this.server = server;
    }

    public String getPending() {
        return this.pending;
    }

    public void setPending(String pending) {
        this.pending = pending;
    }

    @JsonProperty("lastActivity")
    public ZonedDateTime getLastActivity() {
        return this.lastActivity;
    }

    @JsonProperty("last_activity")
    public void setLastActivity(ZonedDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }

    public JsonNode getServers() {
        return this.servers;
    }

    public void setServers(JsonNode servers) {
        this.servers = servers;
    }

}
