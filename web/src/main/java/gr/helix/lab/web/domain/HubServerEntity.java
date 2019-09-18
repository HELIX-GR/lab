package gr.helix.lab.web.domain;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import gr.helix.lab.web.model.HubServerResponse;
import gr.helix.lab.web.model.admin.ServerRegistrationRequest;

@Entity(name = "HubServerEntity")
@Table(
    schema = "lab", name = "hub_server",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_hub_server_server_url", columnNames = {"`server_url`"})
    })
public class HubServerEntity {

	
	@Id
    @Column(name = "`id`", updatable = false)
    @SequenceGenerator(sequenceName = "lab.server_id_seq", name = "server_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "server_id_seq", strategy = GenerationType.SEQUENCE)
	private Integer id;
	
	@Column(name = "`name`")
	private String name;
	
	@Column(name = "`description`")
	private String description;
	
	@Column(name = "`server_url`")
	private String url;
	
	@Column(name = "`available`")
	private Boolean available;
	
	@Column(name = "`admin_token`")
	private String admin_token;
	
	@Column(name = "`started_at`")
	private ZonedDateTime started_at;
	
	@Column(name = "`role_eligible`")
	private String role_eligible;
	
	@Column(name = "`ram`")
	private float ram;
	
	@Column(name = "`vcpu`")
	private float vcpu;
	
	@OneToMany(targetEntity=HubServerTagsEntity.class,mappedBy = "hub_server", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    List<HubServerTagsEntity> tags   = new ArrayList<>();
	

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

	public String getRole_eligible() {
		return role_eligible;
	}

	public void setRole_eligible(String role_eligible) {
		this.role_eligible = role_eligible;
	}

	public ZonedDateTime getStarted_at() {
		return started_at;
	}

	public void setStarted_at(ZonedDateTime started_at) {
		this.started_at = started_at;
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
		List<String> r = new ArrayList<String>();
		for (final HubServerTagsEntity ar : this.tags) {
            r.add(ar.tag);
        }
        return r;	}

 
	public boolean hasTheTag(String tag) {
        for (final HubServerTagsEntity hste: this.tags) {
            if (tag == hste.getTag()) {
                return true;
            }
        }
        return false;
    }
	
	public void setTags(List<String> tags) {
		this.tags.removeAll(this.tags);
		for (String a:tags) {
			if (!hasTheTag(a)) {
			this.tags.add(new HubServerTagsEntity(this, a));
			}
		}
		
	}
	
	public HubServerEntity() {
		
	}
	public void update(ServerRegistrationRequest request) {
		this.name = request.getName();
		this.description = request.getDescription();
		this.url = request.getUrl();
		this.available = request.getAvailable();
		this.admin_token = request.getAdmin_token();
		this.role_eligible = request.getRole_eligible();
		this.started_at = ZonedDateTime.now();
		this.ram = request.getRam();
		this.vcpu = request.getCpus();
		
	//	this.tags = request.getTags();
	}
	
	public HubServerEntity(ServerRegistrationRequest request) {
		this.name = request.getName();
		this.description = request.getDescription();
		this.url = request.getUrl();
		this.available = request.getAvailable();
		this.admin_token = request.getAdmin_token();
		this.role_eligible = request.getRole_eligible();
		this.started_at = ZonedDateTime.now();
		this.ram = request.getRam();
		this.vcpu = request.getCpus();
	//	this.tags = request.getTags();
	}

	public HubServerResponse toHubServerResponse() {
		HubServerResponse resp= new HubServerResponse(id, name);

		resp.setDescription(description);
		resp.setRam(ram);
		resp.setUrl(url);
		resp.setVcpu(vcpu);
		resp.setStarted_at(started_at);
		resp.setTags(this.getTags());
	
		return resp;
	}
	
	
	
}
