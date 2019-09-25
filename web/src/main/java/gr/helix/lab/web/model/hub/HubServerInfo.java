package gr.helix.lab.web.model.hub;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HubServerInfo {

    public static class Authenticator {

        @JsonProperty("class")
        public String className;

        public String version;

    }

    public static class Spawner {

        @JsonProperty("class")
        public String className;

        public String version;

    }

    public String        version;

    public String        python;

    @JsonProperty("sys_executable")
    private String       systemExecutable;

    public Authenticator authenticator;

    public Spawner       spawner;

    public static HubServerInfo parseJsonNode(JsonNode node) throws JsonProcessingException {
        if (node == null) {
            return null;
        }

        final ObjectMapper mapper = new ObjectMapper();

        return mapper.treeToValue(node, HubServerInfo.class);
    }

}
