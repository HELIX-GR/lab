package gr.helix.lab.web.model;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class HubServerResponse implements Serializable{

	private static final long serialVersionUID = 1L;
	 
	private Integer id;
	
	private String name;
	
	private String description;
	
	private String url;
	
	private Boolean available;
	
	@JsonIgnore
	private String admin_token;
	
	private ZonedDateTime started_at;
	
	private String role_eligible;
	
	private float ram;
	
	private float vcpu;
	
	private List<String> tags = new ArrayList<>();

	

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
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

	public ZonedDateTime getStarted_at() {
		return started_at;
	}

	public void setStarted_at(ZonedDateTime started_at) {
		this.started_at = started_at;
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

	public void setRam(float ram) {
		this.ram = ram;
	}

	public float getVcpu() {
		return vcpu;
	}

	public void setVcpu(float vcpu) {
		this.vcpu = vcpu;
	}

	public List<String> getTags() {
		return tags;
	}

	public void setTags(List<String> tags) {
		this.tags = tags;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public HubServerResponse() {
	}

	public HubServerResponse(Integer id, String name) {
		super();
		this.id = id;
		this.name = name;
	}
	

}
