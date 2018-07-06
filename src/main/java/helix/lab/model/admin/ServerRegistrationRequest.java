package helix.lab.model.admin;


import javax.validation.constraints.NotEmpty;


public class ServerRegistrationRequest {
	
   
	public interface ServerSimpleValidation {

    }
	
	@NotEmpty
    private String name;
	@NotEmpty
	private String description;
	@NotEmpty
	private String url;
	@NotEmpty
	private Boolean available;
	@NotEmpty
	private String admin_token;
	@NotEmpty
	private String role_eligible;
    
    public ServerRegistrationRequest() {
	}
    
    
	public ServerRegistrationRequest(@NotEmpty String name, @NotEmpty String description, @NotEmpty String url,
			@NotEmpty Boolean available, @NotEmpty String admin_token, @NotEmpty String role_eligible) {
		this.name = name;
		this.description = description;
		this.url = url;
		this.available = available;
		this.admin_token = admin_token;
		this.role_eligible = role_eligible;
	}


	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Boolean getAvailable() {
		return available;
	}

	public void setAvailable(Boolean available) {
		this.available = available;
	}

	public String getAdmin_token() {
		return admin_token;
	}

	public void setAdmin_token(String admin_token) {
		this.admin_token = admin_token;
	}

	public String getRole_eligible() {
		return role_eligible;
	}

	public void setRole_eligible(String role_eligible) {
		this.role_eligible = role_eligible;
	}

	 @Override
		public String toString() {
			return "ServerRegistrationRequest [name=" + name + ", description=" + description + ", url=" + url
					+ ", available=" + available + ", admin_token=" + admin_token + ", role_eligible=" + role_eligible
					+ "]";
		}
    
}
