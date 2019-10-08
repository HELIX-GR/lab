package gr.helix.lab.web.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpEntity;
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
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.util.Assert;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import gr.helix.core.common.model.ApplicationException;
import gr.helix.core.common.model.BasicErrorCode;
import gr.helix.lab.web.config.ServiceConfiguration;
import gr.helix.lab.web.model.PublishRequest;
import gr.helix.lab.web.model.ckan.ArrayResponse;
import gr.helix.lab.web.model.ckan.CatalogResult;
import gr.helix.lab.web.model.ckan.CkanCatalogQuery;
import gr.helix.lab.web.model.ckan.CkanCatalogResult;
import gr.helix.lab.web.model.ckan.CkanMetadata;
import gr.helix.lab.web.model.ckan.DatasetForm;
import gr.helix.lab.web.model.ckan.Group;
import gr.helix.lab.web.model.ckan.License;
import gr.helix.lab.web.model.ckan.ObjectResponse;
import gr.helix.lab.web.model.ckan.Organization;
import gr.helix.lab.web.model.ckan.Package;
import gr.helix.lab.web.model.ckan.Resource;
import gr.helix.lab.web.model.ckan.Result;
import gr.helix.lab.web.model.ckan.Tag;;

public class CkanServiceProxy {

    // Documentation: http://docs.ckan.org/en/latest/api/index.html

    private static final Logger  logger = LoggerFactory.getLogger(CkanServiceProxy.class);

    private static final int HTTP_PORT = 80;
    private static final int HTTPS_PORT = 443;

    private static final String HTTP_SCHEME = "HTTP";
    private static final String HTTPS_SCHEME = "HTTPS";

    private ObjectMapper         objectMapper;

    private HttpClient           httpClient;

    private ServiceConfiguration ckanConfiguration;

    @PostConstruct
    public void init() throws Exception {
        Assert.notNull(this.objectMapper, "An instance of ObjectMapper is required");
        Assert.notNull(this.httpClient, "An instance of HttpClient is required");
        Assert.notNull(this.ckanConfiguration, "An instance of ServiceConfiguration is required");
    }

    public void setObjectMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void setHttpClient(HttpClient httpClient) {
        this.httpClient = httpClient;
    }

    public void setCkanConfiguration(ServiceConfiguration ckanConfiguration) {
        this.ckanConfiguration = ckanConfiguration;
    }

    public CatalogResult<Package> getPackages(CkanCatalogQuery query, boolean includeFacets) throws ApplicationException {
        try {
            // CKAN start index starts from 0
            final URIBuilder builder = this.createURIBuilder()
                .setPath(this.composePath("api/action/package_search"))
                .addParameter("q", query.getTerm())
                .addParameter("sort", "relevance asc, metadata_modified desc")
                .addParameter("rows", Integer.toString(query.getPageSize()))
                .addParameter("start", Integer.toString(query.getPageSize() * query.getPageIndex()));

            if ((includeFacets) && (query.getFacets() != null)) {
                final String facetQuery = this.buildFacetQuery(query.getFacets());
                if (!StringUtils.isBlank(facetQuery)) {
                    builder.addParameter("facet.field", "[\"license_id\",\"organization\", \"groups\", \"tags\", \"res_format\"]");
                    builder.addParameter("fq", facetQuery);
                }
            }

            final URI uri = builder.build();

            final HttpUriRequest request = RequestBuilder.post(uri)
                .addHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE)
                .build();

            try (CloseableHttpResponse response = (CloseableHttpResponse) this.httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw ApplicationException.fromMessage("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
                }
                final CatalogResult<Package> ckanResponse = this.parsePackages(response);
                ckanResponse.setPageIndex(query.getPageIndex());
                ckanResponse.setPageSize(query.getPageSize());
                return ckanResponse;
            }
        } catch (final ApplicationException ex) {
            throw ex;
        } catch (final Exception ex) {
            this.handleException(ex);
        }
        return null;
    }

    public Package getPackage(String id) {
        try {
            final URIBuilder builder = this.createURIBuilder()
                .setPath(this.composePath("api/action/package_show"))
                .addParameter("id", id);

            final URI uri = builder.build();

            final HttpUriRequest request = RequestBuilder.post(uri)
                .addHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE)
                .build();

            try (CloseableHttpResponse response = (CloseableHttpResponse) this.httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw ApplicationException.fromMessage("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
                }
                return this.parsePackage(response);
            }
        } catch (final ApplicationException ex) {
            throw ex;
        } catch (final Exception ex) {
            this.handleException(ex);
        }
        return null;
    }

    public CkanMetadata getMetadata() {
        final CkanMetadata metadata = new CkanMetadata();

        try {
            final String host = this.createURIBuilder()
                .build()
                .toString();
            metadata.setHost(host);

            metadata.setLicenses(this.getLicenses());
            metadata.setFormats(this.getFormats());
            metadata.setTags(this.getTags());
            metadata.setGroups(this.getGroups());
            metadata.setOrganizations(this.getOrganizations());
        } catch (final URISyntaxException e) {
            // Ignore
        } catch (final Exception e) {
            // Ignore
        }

        return metadata;
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

    private List<License> getLicenses() {
        try {
            final URI uri = this.createURIBuilder()
                .setPath(this.composePath("api/action/license_list"))
                .build();

            final HttpUriRequest request = RequestBuilder.get(uri)
                .addHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE)
                .build();

            try (CloseableHttpResponse response = (CloseableHttpResponse) this.httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw ApplicationException.fromMessage("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
                }
                final ArrayResponse<License> ckanResponse = this.parseLicenses(response);

                return ckanResponse.getResult();
            }
        } catch (final ApplicationException ex) {
            throw ex;
        } catch (final Exception ex) {
            this.handleException(ex);
        }

        return null;
    }

    private List<String> getFormats() {
        try {
            final URI uri = this.createURIBuilder()
                .setPath(this.composePath("api/action/format_autocomplete"))
                .setParameter("q", "")
                .setParameter("limit", "1000")
                .build();

            final HttpUriRequest request = RequestBuilder.get(uri)
                .addHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE)
                .build();

            try (CloseableHttpResponse response = (CloseableHttpResponse) this.httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw ApplicationException.fromMessage("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
                }
                final ArrayResponse<String> ckanResponse = this.parseStringArray(response);

                return ckanResponse.getResult();
            }
        } catch (final ApplicationException ex) {
            throw ex;
        } catch (final Exception ex) {
            this.handleException(ex);
        }

        return null;
    }

    private List<Tag> getTags() {
        try {
            final URI uri = this.createURIBuilder()
                .setPath(this.composePath("api/action/tag_list"))
                .setParameter("all_fields", "true")
                .build();

            final HttpUriRequest request = RequestBuilder.get(uri)
                .addHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE)
                .build();

            try (CloseableHttpResponse response = (CloseableHttpResponse) this.httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw ApplicationException.fromMessage("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
                }
                final ArrayResponse<Tag> ckanResponse = this.parseTags(response);

                return ckanResponse.getResult();
            }
        } catch (final ApplicationException ex) {
            throw ex;
        } catch (final Exception ex) {
            this.handleException(ex);
        }

        return null;
    }

    private List<Organization> getOrganizations() {
        try {
            final URI uri = this.createURIBuilder()
                .setPath(this.composePath("api/action/organization_list"))
                .setParameter("limit", "1000")
                .setParameter("all_fields", "true")
                .build();

            final HttpUriRequest request = RequestBuilder.get(uri)
                .addHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE)
                .build();

            try (CloseableHttpResponse response = (CloseableHttpResponse) this.httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw ApplicationException.fromMessage("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
                }
                final ArrayResponse<Organization> ckanResponse = this.parseOrganizations(response);

                return ckanResponse.getResult();
            }
        } catch (final ApplicationException ex) {
            throw ex;
        } catch (final Exception ex) {
            this.handleException(ex);
        }

        return null;
    }

    private List<Group> getGroups() {
        try {
            final URI uri = this.createURIBuilder()
                .setPath(this.composePath("api/action/group_list"))
                .setParameter("limit", "1000")
                .setParameter("all_fields", "true")
                .build();

            final HttpUriRequest request = RequestBuilder.get(uri)
                .addHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE)
                .build();

            try (CloseableHttpResponse response = (CloseableHttpResponse) this.httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw ApplicationException.fromMessage("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
                }
                final ArrayResponse<Group> ckanResponse = this.parseGroups(response);

                return ckanResponse.getResult();
            }
        } catch (final ApplicationException ex) {
            throw ex;
        } catch (final Exception ex) {
            this.handleException(ex);
        }

        return null;
    }

    private CatalogResult<Package> parsePackages(HttpResponse response) {
        try (InputStream contentStream = response.getEntity().getContent()) {
            final ObjectResponse<Result<Package>> ckanResponse =
                this.objectMapper.readValue(contentStream, new TypeReference<ObjectResponse<Result<Package>>>() { });

            final CkanCatalogResult<Package> result = new CkanCatalogResult<Package>();
            result.setCount(ckanResponse.getResult().getCount());
            result.setResults(ckanResponse.getResult().getResults());
            result.setFacets(ckanResponse.getResult().getFacets());
            result.setSearchFacets(ckanResponse.getResult().getSearchFacets());
            return result;

        } catch (final IOException ex) {
            logger.error("An I/O exception has occurred while reading the response content", ex);
        }

        throw ApplicationException.fromMessage("Failed to read response");
    }

    private Package parsePackage(HttpResponse response) {
        try (InputStream contentStream = response.getEntity().getContent()) {
            final ObjectResponse<Package> ckanResponse =
                this.objectMapper.readValue(contentStream, new TypeReference<ObjectResponse<Package>>() { });

            if(ckanResponse.isSuccess()) {
                return ckanResponse.getResult();
            }
            return null;

        } catch (final IOException ex) {
            logger.error("An I/O exception has occurred while reading the response content", ex);
        }

        throw ApplicationException.fromMessage("Failed to read response");
    }

    private Resource parseResource(HttpResponse response) {
        try (InputStream contentStream = response.getEntity().getContent()) {
            final ObjectResponse<Resource> ckanResponse =
                this.objectMapper.readValue(contentStream, new TypeReference<ObjectResponse<Resource>>() { });

            if(ckanResponse.isSuccess()) {
                return ckanResponse.getResult();
            }
            return null;

        } catch (final IOException ex) {
            logger.error("An I/O exception has occurred while reading the response content", ex);
        }

        throw ApplicationException.fromMessage("Failed to read response");
    }

    private ArrayResponse<Organization> parseOrganizations(HttpResponse response) {
        try (InputStream contentStream = response.getEntity().getContent()) {
            return this.objectMapper.readValue(contentStream, new TypeReference<ArrayResponse<Organization>>() { });
        } catch (final IOException ex) {
            logger.error("An I/O exception has occurred while reading the response content", ex);
        }

        throw ApplicationException.fromMessage("Failed to read response");
    }

    private ArrayResponse<Group> parseGroups(HttpResponse response) {
        try (InputStream contentStream = response.getEntity().getContent()) {
            return this.objectMapper.readValue(contentStream, new TypeReference<ArrayResponse<Group>>() { });
        } catch (final IOException ex) {
            logger.error("An I/O exception has occurred while reading the response content", ex);
        }

        throw ApplicationException.fromMessage("Failed to read response");
    }

    private ArrayResponse<License> parseLicenses(HttpResponse response) {
        try (InputStream contentStream = response.getEntity().getContent()) {
            return this.objectMapper.readValue(contentStream, new TypeReference<ArrayResponse<License>>() { });
        } catch (final IOException ex) {
            logger.error("An I/O exception has occurred while reading the response content", ex);
        }

        throw ApplicationException.fromMessage("Failed to read response");
    }

    private ArrayResponse<Tag> parseTags(HttpResponse response) {
        try (InputStream contentStream = response.getEntity().getContent()) {
            return this.objectMapper.readValue(contentStream, new TypeReference<ArrayResponse<Tag>>() { });
        } catch (final IOException ex) {
            logger.error("An I/O exception has occurred while reading the response content", ex);
        }

        throw ApplicationException.fromMessage("Failed to read response");
    }

    private ArrayResponse<String> parseStringArray(HttpResponse response) {
        try (InputStream contentStream = response.getEntity().getContent()) {
            return this.objectMapper.readValue(contentStream, new TypeReference<ArrayResponse<String>>() { });
        } catch (final IOException ex) {
            logger.error("An I/O exception has occurred while reading the response content", ex);
        }

        throw ApplicationException.fromMessage("Failed to read response");
    }

    private String composePath(String path) {
        final String relativePath = this.ckanConfiguration.getPath();
        if (StringUtils.isBlank(relativePath)) {
            return path;
        }
        return relativePath + "/" + path;
    }

    private String buildFacetQuery(CkanCatalogQuery.FacetQuery query) {
        String queryString = "";

        queryString += this.buildFacetQueryExpression("license_id", query.getLicenses());
        queryString += this.buildFacetQueryExpression("tags", query.getTags());
        queryString += this.buildFacetQueryExpression("res_format", query.getFormats());
        queryString += this.buildFacetQueryExpression("groups", query.getGroups());
        queryString += this.buildFacetQueryExpression("organization", query.getOrganizations());

        return queryString;
    }

    private String buildFacetQueryExpression(String key, List<String> values) {
        if ((values != null) && (values.size() > 0)) {
            final String expression = values.stream()
                .map(value -> "\"" + value + "\"")
                .collect(Collectors.joining(" OR "));

            return String.format("+%s:(%s)", key, expression);
        }

        return "";
    }

    public Package createDataset(PublishRequest query, String maintainerEmail) throws ApplicationException {
        final String packageId = UUID.randomUUID().toString();

        try {
            final URI uri = this.createURIBuilder()
                .setPath(this.composePath("/api/action/package_create"))
                .build();

            final DatasetForm form = new DatasetForm();

            form.setName(packageId);
            form.setTitle(query.getTitle());
            form.setNotes(query.getDescription());
            form.setOwnerOrganization(this.ckanConfiguration.getPublisherOrganization());
            form.setReturnIdOnly(false);
            form.setMaintainerEmail(maintainerEmail);

            if (query.getTags() != null) {
                for (final String tag : query.getTags()) {
                    form.addTag(tag);
                }
            }

            final String content = this.objectMapper.writeValueAsString(form);
            final StringEntity entity = new StringEntity(
                content,
                ContentType.APPLICATION_JSON
            );

            final HttpUriRequest req = RequestBuilder.post(uri)
                .addHeader(HttpHeaders.AUTHORIZATION , this.ckanConfiguration.getApikey())
                .addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE)
                .setEntity(entity)
                .build();

            try (CloseableHttpResponse response = (CloseableHttpResponse) this.httpClient.execute(req)) {
                final int status = response.getStatusLine().getStatusCode();

                if (status != 200) {
                    throw ApplicationException.fromMessage("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
                }
                final Package dataset = this.parsePackage(response);

                return dataset;
            }
        } catch (final ApplicationException ex) {
            throw ex;
        } catch (final Exception ex) {
            this.handleException(ex);
        }
        return null;
    }

    public Resource createResource(PublishRequest query, File  file, String package_id) throws ApplicationException {
        try {
            final URI uri = this.createURIBuilder()
                .setPath(this.composePath("/api/action/resource_create"))
                .build();


            final HttpEntity requestEntity = MultipartEntityBuilder.create()
            		.addBinaryBody("upload", file,  ContentType.DEFAULT_BINARY, file.getName())
            		.addTextBody("package_id", package_id)
					.addTextBody("url", "")
					.addTextBody("name", query.getFilerename())
					.addTextBody("format", FilenameUtils.getExtension(query.getFilename()))
					.build();

            final HttpUriRequest req = RequestBuilder.post(uri)
                .addHeader(HttpHeaders.AUTHORIZATION , this.ckanConfiguration.getApikey())
                .setEntity(requestEntity)
                .build();

            try (CloseableHttpResponse response = (CloseableHttpResponse) this.httpClient.execute(req)) {
                final int status = response.getStatusLine().getStatusCode();

                if (status != 200) {
                    throw ApplicationException.fromMessage("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
                }
                final Resource resource = this.parseResource(response);

                return resource;
            }
        } catch (final ApplicationException ex) {
            throw ex;
        } catch (final Exception ex) {
            this.handleException(ex);
        }
        return null;
    }

    private URIBuilder createURIBuilder() {
        final ServiceConfiguration config = this.ckanConfiguration;

        final URIBuilder builder = new URIBuilder()
            .setScheme(config.getScheme())
            .setHost(config.getHost());

        if ((config.getScheme().equalsIgnoreCase(HTTP_SCHEME) && config.getPort() != HTTP_PORT) ||
            (config.getScheme().equalsIgnoreCase(HTTPS_SCHEME) && config.getPort() != HTTPS_PORT))
        {
            builder.setPort(config.getPort());
        }

        return builder;
    }

}