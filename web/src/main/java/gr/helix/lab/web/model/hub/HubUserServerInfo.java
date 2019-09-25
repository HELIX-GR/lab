package gr.helix.lab.web.model.hub;

import java.time.ZonedDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

public class HubUserServerInfo {

    private String        name;

    private boolean       ready;

    private String        pending;

    private String        url;

    private String        progressUrl;

    private ZonedDateTime startedAt;

    private ZonedDateTime lastActivity;

    private JsonNode      state;

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isReady() {
        return this.ready;
    }

    public void setReady(boolean ready) {
        this.ready = ready;
    }

    public String getPending() {
        return this.pending;
    }

    public void setPending(String pending) {
        this.pending = pending;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @JsonProperty("progressUrl")
    public String getProgressUrl() {
        return this.progressUrl;
    }

    @JsonProperty("progress_url")
    public void setProgressUrl(String progressUrl) {
        this.progressUrl = progressUrl;
    }

    @JsonProperty("startedAt")
    public ZonedDateTime getStartedAt() {
        return this.startedAt;
    }

    @JsonProperty("started")
    public void setStartedAt(ZonedDateTime startedAt) {
        this.startedAt = startedAt;
    }

    @JsonProperty("lastActivity")
    public ZonedDateTime getLastActivity() {
        return this.lastActivity;
    }

    @JsonProperty("last_activity")
    public void setLastActivity(ZonedDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }

    @JsonIgnore()
    public JsonNode getState() {
        return this.state;
    }

    @JsonProperty()
    public void setState(JsonNode state) {
        this.state = state;
    }

}
