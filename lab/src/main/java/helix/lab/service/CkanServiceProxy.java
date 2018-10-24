package helix.lab.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import gr.helix.core.common.model.ApplicationException;
import gr.helix.core.common.model.BasicErrorCode;
import helix.lab.config.ServiceConfiguration;
import helix.lab.model.PublishRequest;
import helix.lab.model.ckan.ArrayResponse;
import helix.lab.model.ckan.CatalogResult;
import helix.lab.model.ckan.CkanCatalogQuery;
import helix.lab.model.ckan.CkanCatalogResult;
import helix.lab.model.ckan.CkanMetadata;
import helix.lab.model.ckan.Group;
import helix.lab.model.ckan.License;
import helix.lab.model.ckan.ObjectResponse;
import helix.lab.model.ckan.Organization;
import helix.lab.model.ckan.Package;
import helix.lab.model.ckan.Result;
import helix.lab.model.ckan.Tag;;

@Service
public class CkanServiceProxy {

    private static final Logger  logger = LoggerFactory.getLogger(CkanServiceProxy.class);

    @Autowired
    private ObjectMapper         objectMapper;

    @Autowired
    private HttpClient           httpClient;

    @Autowired
    private ServiceConfiguration ckanConfiguration;

    public CatalogResult<Package> getPackages(CkanCatalogQuery query, boolean includeFacets) throws ApplicationException {
        try {
            // Documentation: http://docs.ckan.org/en/latest/api/index.html

            // CKAN start index starts from 0
            final URIBuilder builder = new URIBuilder()
                .setScheme(this.ckanConfiguration.getScheme())
                .setHost(this.ckanConfiguration.getHost())
                .setPort(this.ckanConfiguration.getPort())
                .setPath(this.composePath("/api/action/package_search"))
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

    public CkanMetadata getMetadata() {
        final CkanMetadata metadata = new CkanMetadata();

        metadata.setLicenses(this.getLicenses());
        metadata.setFormats(this.getFormats());
        metadata.setTags(this.getTags());
        metadata.setGroups(this.getGroups());
        metadata.setOrganizations(this.getOrganizations());


        try {
            final String host = new URIBuilder()
                .setScheme(this.ckanConfiguration.getScheme())
                .setHost(this.ckanConfiguration.getHost())
                .setPort(this.ckanConfiguration.getPort())
                .build()
                .toString();
            metadata.setHost(host);
        } catch (final URISyntaxException e) {
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
            final URI uri = new URIBuilder()
                .setScheme(this.ckanConfiguration.getScheme())
                .setHost(this.ckanConfiguration.getHost())
                .setPort(this.ckanConfiguration.getPort())
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
            final URI uri = new URIBuilder()
                .setScheme(this.ckanConfiguration.getScheme())
                .setHost(this.ckanConfiguration.getHost())
                .setPort(this.ckanConfiguration.getPort())
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
            final URI uri = new URIBuilder()
                .setScheme(this.ckanConfiguration.getScheme())
                .setHost(this.ckanConfiguration.getHost())
                .setPort(this.ckanConfiguration.getPort())
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
            final URI uri = new URIBuilder()
                .setScheme(this.ckanConfiguration.getScheme())
                .setHost(this.ckanConfiguration.getHost())
                .setPort(this.ckanConfiguration.getPort())
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
            final URI uri = new URIBuilder()
                .setScheme(this.ckanConfiguration.getScheme())
                .setHost(this.ckanConfiguration.getHost())
                .setPort(this.ckanConfiguration.getPort())
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
            logger.error("An I/O exception has occured while reading the response content", ex);
        }

        throw ApplicationException.fromMessage("Failed to read response");
    }

    private ArrayResponse<Organization> parseOrganizations(HttpResponse response) {
        try (InputStream contentStream = response.getEntity().getContent()) {
            return this.objectMapper.readValue(contentStream, new TypeReference<ArrayResponse<Organization>>() { });
        } catch (final IOException ex) {
            logger.error("An I/O exception has occured while reading the response content", ex);
        }

        throw ApplicationException.fromMessage("Failed to read response");
    }

    private ArrayResponse<Group> parseGroups(HttpResponse response) {
        try (InputStream contentStream = response.getEntity().getContent()) {
            return this.objectMapper.readValue(contentStream, new TypeReference<ArrayResponse<Group>>() { });
        } catch (final IOException ex) {
            logger.error("An I/O exception has occured while reading the response content", ex);
        }

        throw ApplicationException.fromMessage("Failed to read response");
    }

    private ArrayResponse<License> parseLicenses(HttpResponse response) {
        try (InputStream contentStream = response.getEntity().getContent()) {
            return this.objectMapper.readValue(contentStream, new TypeReference<ArrayResponse<License>>() { });
        } catch (final IOException ex) {
            logger.error("An I/O exception has occured while reading the response content", ex);
        }

        throw ApplicationException.fromMessage("Failed to read response");
    }

    private ArrayResponse<Tag> parseTags(HttpResponse response) {
        try (InputStream contentStream = response.getEntity().getContent()) {
            return this.objectMapper.readValue(contentStream, new TypeReference<ArrayResponse<Tag>>() { });
        } catch (final IOException ex) {
            logger.error("An I/O exception has occured while reading the response content", ex);
        }

        throw ApplicationException.fromMessage("Failed to read response");
    }

    private ArrayResponse<String> parseStringArray(HttpResponse response) {
        try (InputStream contentStream = response.getEntity().getContent()) {
            return this.objectMapper.readValue(contentStream, new TypeReference<ArrayResponse<String>>() { });
        } catch (final IOException ex) {
            logger.error("An I/O exception has occured while reading the response content", ex);
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
    // Create a new dataset in CKAN
    public Object createNewDataset(PublishRequest query, String package_id) throws ApplicationException {
        try {
            // Documentation: http://docs.ckan.org/en/latest/api/index.html

            // CKAN start index starts from 0
            final URIBuilder builder = new URIBuilder()
                .setScheme(this.ckanConfiguration.getScheme())
                .setHost(this.ckanConfiguration.getHost())
                .setPort(this.ckanConfiguration.getPort())
                .setPath(this.composePath("/api/action/package_create"));


            final URI uri = builder.build();
            JSONArray tags = new JSONArray();
            for (String s: query.getTags()) {
            	tags.put(new JSONObject().put("name", s));
            	
            }

            JSONObject  data= new JSONObject()
            		.put("name", package_id)
            		.put("title",query.getTitle())
            		.put("notes",query.getDescription())
            		.put("owner_org",this.ckanConfiguration.getPublisherOrganization())
            		.put("return_id_only","True")
            		.put("tags", tags);

            final HttpUriRequest req = RequestBuilder.post(uri)
                //.addHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                //.addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .addHeader(HttpHeaders.AUTHORIZATION , this.ckanConfiguration.getApikey().toString())
                .setEntity( new StringEntity(data.toString(), ContentType.create("application/json")))
                .build();
           
            try (CloseableHttpResponse response = (CloseableHttpResponse) this.httpClient.execute(req)) {
            	
            	//return response;
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw ApplicationException.fromMessage("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
                }
                final CatalogResult<Package> ckanResponse = this.parsePackages(response);
                
                return ckanResponse;
            }
        } catch (final ApplicationException ex) {
            throw ex;
        } catch (final Exception ex) {
            this.handleException(ex);
        }
        return null;
    }

    
    
    // Create a new resource  in CKAN
    public Object createNewResource(PublishRequest query, File  file, String package_id) throws ApplicationException {
        try {
            // Documentation: http://docs.ckan.org/en/latest/api/index.html
            // CKAN start index starts from 0
            final URIBuilder builder = new URIBuilder()
                .setScheme(this.ckanConfiguration.getScheme())
                .setHost(this.ckanConfiguration.getHost())
                .setPort(this.ckanConfiguration.getPort())
                .setPath(this.composePath("/api/action/resource_create"));


            final URI uri = builder.build();


            // build multipart upload request
            HttpEntity mpEntity = MultipartEntityBuilder.create()
            		.addBinaryBody("upload", file,  ContentType.DEFAULT_BINARY, file.getName())
            		.addTextBody("package_id", package_id)
					.addTextBody("url", "")
					.addTextBody("name", query.getFilerename())
					.addTextBody("format", FilenameUtils.getExtension(query.getFilename()))
					.build();
         

            final HttpUriRequest req = RequestBuilder.post(uri)
                .addHeader(HttpHeaders.AUTHORIZATION , this.ckanConfiguration.getApikey().toString())
                .setEntity(mpEntity)
                .build();
            
            System.out.println("Executing request " + req.getRequestLine());
            ResponseHandler<String> responseHandler = response -> {
            int status = response.getStatusLine().getStatusCode();
            if (status >= 200 && status < 300) {
                HttpEntity entity = response.getEntity();
                return entity != null ? EntityUtils.toString(entity) : null;
            } else {
            	System.out.println(response.toString());
            	return null;
               // throw new ClientProtocolException("Unexpected response status: " + status);
            }};
       
        	String responseBody = this.httpClient.execute(req, responseHandler);
            System.out.println("----------------------------------------");
            System.out.println(responseBody);
            return responseBody;
        
        } catch (final ApplicationException ex) {
            throw ex;
        } catch (final Exception ex) {
            this.handleException(ex);
        }
        return null;
    }
    
    //------------------------- pachage show ----------------------------------------TODO
    public Package getPackageById(String id) throws ApplicationException {
        try {
            // Documentation: http://docs.ckan.org/en/latest/api/index.html

            // CKAN start index starts from 0
            final URIBuilder builder = new URIBuilder()
                .setScheme(this.ckanConfiguration.getScheme())
                .setHost(this.ckanConfiguration.getHost())
                .setPort(this.ckanConfiguration.getPort())
                .setPath(this.composePath("/api/action/package_show"))
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
                final Package ckanResponse = this.parseOnePackageShow(response);
                
                return ckanResponse;
            }
        } catch (final ApplicationException ex) {
            throw ex;
        } catch (final Exception ex) {
            this.handleException(ex);
        }
        return null;
    }
    
    
    private Package parseOnePackageShow(HttpResponse response) {
        try (InputStream contentStream = response.getEntity().getContent()) {
            final ObjectResponse<Package> ckanResponse =
                this.objectMapper.readValue(contentStream, new TypeReference<ObjectResponse<Package>>() { });
            return ckanResponse.getResult();

        } catch (final IOException ex) {
            logger.error("An I/O exception has occured while reading the response content", ex);
        }

        throw ApplicationException.fromMessage("Failed to read response");
    }

}