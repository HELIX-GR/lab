package gr.helix.lab.web.config;

public class ServiceConfiguration {

    private String scheme;

    private String host;

    private int    port;

    private String path;
    
    private String apikey;
    
    public String getPublisherOrganization() {
		return publisherOrganization;
	}

	public void setPublisherOrganization(String publisherOrganization) {
		this.publisherOrganization = publisherOrganization;
	}

	private String publisherOrganization;

    public String getScheme() {
        return this.scheme;
    }

    public void setScheme(String scheme) {
        this.scheme = scheme;
    }

    public String getHost() {
        return this.host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return this.port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getPath() {
        return this.path;
    }

    public void setPath(String path) {
        this.path = path;
    }

	public String getApikey() {
		return apikey;
	}

	public void setApikey(String apikey) {
		this.apikey = apikey;
	}
    

}
