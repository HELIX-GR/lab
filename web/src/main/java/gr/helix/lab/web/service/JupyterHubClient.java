package gr.helix.lab.web.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import gr.helix.core.common.model.ApplicationException;
import gr.helix.core.common.model.BasicErrorCode;
import gr.helix.lab.web.domain.HubServerEntity;
import gr.helix.lab.web.model.admin.AdminErrorCode;
import gr.helix.lab.web.model.hub.HubServerInfo;
import gr.helix.lab.web.model.hub.HubUserInfo;

@Service
public class JupyterHubClient {

    public static class Context {

        private final String url;
        private final String token;
        private final String userName;

        public Context(String url, String token, String userName) {
            Assert.isTrue(!StringUtils.isBlank(url), "Expected a non-empty url");
            Assert.isTrue(!StringUtils.isBlank(token), "Expected a non-empty token");
            Assert.isTrue(!StringUtils.isBlank(userName), "Expected a non-empty username");

            this.url = url;
            this.token = token;
            this.userName = userName;
        }

        public String getUrl() {
            return this.url;
        }

        public String getToken() {
            return this.token;
        }

        public String getUserName() {
            return this.userName;
        }

    }

    public static class ClientResponse {

        public JsonNode result;

        public int      status;

        public ClientResponse() {
            this.status = HttpStatus.SC_OK;
        }

        public ClientResponse(int status) {
            this.status = status;
        }

        public ClientResponse(int status, JsonNode result) {
            this.status = status;
            this.result = result;
        }

    }

    // Documentation: https://jupyterhub.readthedocs.io/en/stable/_static/rest-api/index.html

    private static final Logger logger = LoggerFactory.getLogger(JupyterHubClient.class);

    @Autowired
    private ObjectMapper        objectMapper;

    @Autowired
    private HttpClient          httpClient;

    private <T> ClientResponse request(
        String url, String token, String path, String method, T data
    ) throws ApplicationException {
        try {
            final URI uri = new URIBuilder(url)
                .setPath("/hub/api/" + path)
                .build();

            final RequestBuilder builder = this.getBuilder(method, uri)
                .addHeader(HttpHeaders.AUTHORIZATION , "token " + token)
                .addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);

            if ((method.equals("POST") || method.equals("DELETE")) && data != null) {
                final StringEntity entity = new StringEntity(
                    this.objectMapper.writeValueAsString(data),
                    ContentType.APPLICATION_JSON
                );

                builder.setEntity(entity);
            }

            final HttpUriRequest request = builder.build();

            try (CloseableHttpResponse response = (CloseableHttpResponse) this.httpClient.execute(request)) {
                final int status = response.getStatusLine().getStatusCode();

                if (status >= 200 && status < 300) {
                    if(method.equals("POST") || method.equals("GET")) {
                        final JsonNode result = this.parseResponse(response);

                        return new ClientResponse(status, result);
                    }

                    return new ClientResponse(status);
                }

                throw ApplicationException.fromMessage("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
            }
        } catch (final ApplicationException ex) {
            throw ex;
        } catch (final Exception ex) {
            this.handleException(ex);
        }
        return null;
    }

    private ClientResponse get(
        String url, String token, String path
    ) throws ApplicationException {
        return this.<Class<?>>request(url, token, path, "GET", null);
    }

    private ClientResponse post(
        String url, String token, String path
    ) throws ApplicationException {
        return this.request(url, token, path, "POST", null);
    }

    private <T> ClientResponse post(
        String url, String token, String path, T data
    ) throws ApplicationException {
        return this.<T>request(url, token, path, "POST", data);
    }

    private ClientResponse delete(
        String url, String token, String path
    ) throws ApplicationException {
        return this.request(url, token, path, "DELETE", null);
    }

    private <T> ClientResponse delete(
        String url, String token, String path, T data
    ) throws ApplicationException {
        return this.<T>request(url, token, path, "DELETE", data);
    }

    public HubServerInfo getHubStatus(String url, String token) {
        try {
            final ClientResponse response = this.get(url, token, "info");

            return this.objectMapper.treeToValue(response.result, HubServerInfo.class);
        } catch (final JsonProcessingException e) {
            throw ApplicationException.fromMessage(AdminErrorCode.HUB_SERVER_PARSE_ERROR, "Failed to parse server response");
        }
    }

    public HubUserInfo getUserInfo(Context ctx) throws ApplicationException {
        return this.getUserInfo(ctx.url, ctx.token, ctx.userName);
    }

    public HubUserInfo getUserInfo(String url, String token, String username) throws ApplicationException {
        try {
            final ClientResponse response = this.get(url, token, "users/" + username);

            return this.objectMapper.treeToValue(response.result, HubUserInfo.class);
        } catch (final JsonProcessingException e) {
            throw ApplicationException.fromMessage(AdminErrorCode.HUB_SERVER_PARSE_ERROR, "Failed to parse server response");
        }
    }

    public HubUserInfo addUser(Context context) throws ApplicationException {
        return this.addUser(context.getUrl(), context.getToken(), context.getUserName());
    }

    public HubUserInfo addUser(String url, String token, String username) throws ApplicationException {
        try {
            final ClientResponse response = this.post(url, token, "users/" + username);

            return this.objectMapper.treeToValue(response.result, HubUserInfo.class);
        } catch (final JsonProcessingException e) {
            throw ApplicationException.fromMessage(AdminErrorCode.HUB_SERVER_PARSE_ERROR, "Failed to parse server response");
        }
    }

    public boolean removeUser(HubServerEntity server, String username) throws ApplicationException {
        return this.removeUser(server.getUrl(), server.getToken(), username);
    }

    public boolean removeUser(String url, String token, String username) throws ApplicationException {
        final ClientResponse response = this.delete(url, token, "users/" + username);

        return response.status == HttpStatus.SC_NO_CONTENT;
    }

    public boolean startServer(Context context) throws ApplicationException {
        return this.startServer(context.getUrl(), context.getToken(), context.getUserName());
    }

    public boolean startServer(String url, String token, String username) throws ApplicationException {
        final ClientResponse response = this.post(url, token, "users/" + username + "/server");

        return response.status == HttpStatus.SC_CREATED;
    }

    public boolean stopServer(Context context) throws ApplicationException {
        return this.stopServer(context.getUrl(), context.getToken(), context.getUserName());
    }

    public boolean stopServer(String url, String token, String username) throws ApplicationException {
        final ClientResponse response = this.delete(url, token, "users/" + username + "/server");

        return response.status == HttpStatus.SC_NO_CONTENT;
    }

    public boolean removeUserFromGroups(Context context, List<String> groups) throws ApplicationException {
        return this.removeUserFromGroups(
            context.getUrl(), context.getToken(), context.getUserName(), groups
        );
    }

    public boolean removeUserFromGroups(
        String url, String token, String username, List<String> groups
    ) throws ApplicationException {
        final Map<String, String[]> users = new HashMap<String, String[]>();
        users.put("users", new String[]{username});

        boolean result = true;

        for(final String group: groups) {
            final ClientResponse response = this.delete(url, token, "groups/" + group + "/users", users);

            result = result && (response.status == HttpStatus.SC_OK);
        }

        return result;
    }

    public boolean addUserToGroup(Context context, String group) throws ApplicationException {
        return this.addUserToGroup(context.getUrl(), context.getToken(), context.getUserName(), group);
    }

    public boolean addUserToGroup(
        String url, String token, String username, String group
    ) throws ApplicationException {
        final Map<String, String[]> users = new HashMap<String, String[]>();
        users.put("users", new String[]{username});

        final ClientResponse response = this.post(url, token, "groups/" + group + "/users", users);

        return (response.status == HttpStatus.SC_OK);
    }

    private RequestBuilder getBuilder(String method, URI uri) throws Exception {
        switch (method) {
            case "POST" :
                return RequestBuilder.post(uri);
            case "GET" :
                return RequestBuilder.get(uri);
            case "DELETE" :
                return RequestBuilder.delete(uri);
            default :
                logger.error("Method {} is not supported", method);
                throw new Exception("Method not supported");
        }
    }

    private JsonNode parseResponse(HttpResponse response) {
        try (InputStream contentStream = response.getEntity().getContent()) {
            final JsonNode result = this.objectMapper.readTree(contentStream);

            return result;
        } catch (final IOException ex) {
            logger.error("An I/O exception has occured while reading the response content", ex);
        }

        throw ApplicationException.fromMessage("Failed to read response");
    }

    private void handleException(Exception ex) {
        if (ex instanceof URISyntaxException) {
            logger.error("The input is not a valid URI", ex);
            throw ApplicationException.fromPattern(ex, BasicErrorCode.URI_SYNTAX_ERROR);
        }
        if (ex instanceof ClientProtocolException) {
            logger.error("An HTTP protocol error has occurred", ex);
            throw ApplicationException.fromPattern(ex, BasicErrorCode.HTTP_ERROR);
        }
        if (ex instanceof IOException) {
            logger.error("An I/O exception has occurred or the connection was aborted", ex);
            throw ApplicationException.fromPattern(ex, BasicErrorCode.IO_ERROR);
        }

        throw ApplicationException.fromPattern(BasicErrorCode.UNKNOWN);
    }

}
