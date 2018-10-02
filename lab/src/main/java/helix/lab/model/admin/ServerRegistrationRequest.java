package helix.lab.model.admin;


import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


public class ServerRegistrationRequest {
	
   
	public interface ServerSimpleValidation {

    }
	@Size(min=4,max=30)
	@NotEmpty
    private String name;
	@NotEmpty
	private String description;
	@NotEmpty
	private String url;
	@NotNull
	private Boolean available;
	@NotEmpty
	private String admin_token;
	@NotEmpty
	private String role_eligible;
	@NotNull	
    private float ram;
	@NotNull	
    private float cpus;
	
    private List<String> tags;
    
    public ServerRegistrationRequest() {
	}
    
    
	public ServerRegistrationRequest(@NotEmpty String name, @NotEmpty String description, @NotEmpty String url,
			@NotEmpty Boolean available, @NotEmpty String admin_token, @NotEmpty String role_eligible,
			@NotEmpty int ram, @NotEmpty int cpus, @NotEmpty List<String> tags) {
		this.name = name;
		this.description = description;
		this.url = url;
		this.available = available;
		this.admin_token = admin_token;
		this.role_eligible = role_eligible;
		this.ram = ram;
		this.cpus = cpus;
		this.tags = tags;
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


	public float getRam() {
		return ram;
	}


	public void setRam(int ram) {
		this.ram = ram;
	}


	public float getCpus() {
		return cpus;
	}


	public void setCpus(int cpus) {
		this.cpus = cpus;
	}


	public List<String> getTags() {
		return tags;
	}


	public void setTags(List<String> tags) {
		this.tags = tags;
	}

	
}
