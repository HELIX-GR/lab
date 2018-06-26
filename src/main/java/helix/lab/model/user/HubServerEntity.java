package helix.lab.model.user;

import java.time.ZonedDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity(name = "HubServerEntity")
@Table(
    schema = "helix_lab", name = "hub_server",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_account_username", columnNames = {"`server_url`"})
    })
public class HubServerEntity {

	
	@Id
    @Column(name = "`id`", updatable = false)
    @SequenceGenerator(sequenceName = "helix_lab.server_id_seq", name = "server_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "server_id_seq", strategy = GenerationType.SEQUENCE)
    Integer id;
	
	@Column(name = "`name`")
    String name;
	
	@Column(name = "`description`")
    String description;
	
	@Column(name = "`server_url`")
    String url;
	
	@Column(name = "`available`")
    Boolean available;
	
	@Column(name = "`admin_token`")
    String admin_token;
	
	@Column(name = "`started_at`")
	ZonedDateTime started_at;
	
	@Column(name = "`role_eligible`")
    String role_eligible;

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

	public HubServerEntity() {
		
	}

	public HubServerEntity(ServerRegistrationRequest request) {
		this.name = request.getName();
		this.description = request.getDescription();
		this.url = request.getUrl();
		this.available = request.getAvailable();
		this.admin_token = request.getAdmin_token();
		this.role_eligible = request.getRole_eligible();
		this.started_at = ZonedDateTime.now();
		}
	
	
	
}
