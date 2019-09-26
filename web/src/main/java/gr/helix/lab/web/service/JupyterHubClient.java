package gr.helix.lab.web.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.commons.httpclient.HttpStatus;
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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import gr.helix.core.common.model.ApplicationException;
import gr.helix.core.common.model.BasicErrorCode;
import gr.helix.lab.web.model.admin.AdminErrorCode;
import gr.helix.lab.web.model.hub.HubServerInfo;
import gr.helix.lab.web.model.hub.HubUserInfo;

@Service
public class JupyterHubClient {

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

            if (method.equals("POST") && data != null) {
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

    @SuppressWarnings("unused")
    private <T> ClientResponse post(
        String url, String token, String path, T data
    ) throws ApplicationException {
        return this.<T>request(url, token, path, "POST", data);
    }

    private ClientResponse delete(
        String url, String token, String path
    ) throws ApplicationException {
        return this.<Class<?>>request(url, token, path, "DELETE", null);
    }

    public HubServerInfo getHubStatus(String url, String token) {
        try {
            final ClientResponse response = this.get(url, token, "info");

            return this.objectMapper.treeToValue(response.result, HubServerInfo.class);
        } catch (final JsonProcessingException e) {
            throw ApplicationException.fromMessage(AdminErrorCode.HUB_SERVER_PARSE_ERROR, "Failed to parse server response");
        }
    }

    public HubUserInfo getUserInfo(String url, String token, String username) throws ApplicationException {
        try {
            final ClientResponse response = this.get(url, token, "users/" + username);

            return this.objectMapper.treeToValue(response.result, HubUserInfo.class);
        } catch (final JsonProcessingException e) {
            throw ApplicationException.fromMessage(AdminErrorCode.HUB_SERVER_PARSE_ERROR, "Failed to parse server response");
        }
    }

    public HubUserInfo addUser(String url, String token, String username) throws ApplicationException {
        try {
            final ClientResponse response = this.post(url, token, "users/" + username);

            return this.objectMapper.treeToValue(response.result, HubUserInfo.class);
        } catch (final JsonProcessingException e) {
            throw ApplicationException.fromMessage(AdminErrorCode.HUB_SERVER_PARSE_ERROR, "Failed to parse server response");
        }
    }

    public boolean removeUser(String url, String token, String username) throws ApplicationException {
        final ClientResponse response = this.delete(url, token, "users/" + username);

        return response.status == HttpStatus.SC_NO_CONTENT;
    }

    public boolean startServer(String url, String token, String username) throws ApplicationException {
        final ClientResponse response = this.post(url, token, "users/" + username + "/server");

        return response.status == HttpStatus.SC_CREATED;
    }

    public boolean stopServer(String url, String token, String username) throws ApplicationException {
        final ClientResponse response = this.delete(url, token, "users/" + username + "/server");

        return response.status == HttpStatus.SC_NO_CONTENT;
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