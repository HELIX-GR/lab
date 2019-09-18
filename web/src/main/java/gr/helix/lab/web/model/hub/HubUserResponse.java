package gr.helix.lab.web.model.hub;

import java.time.ZonedDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class HubUserResponse {

	
	String name;
	String kind;
	List<String> groups;
	String server;
	String pending;
	Object servers;
	ZonedDateTime last_activity;
	@JsonIgnore
	String created;
	Boolean admin;
	@JsonIgnore
	String auth_state;
	
	public HubUserResponse(String name, String kind, List<String> groups, String server, String pending, Object servers,
			ZonedDateTime last_activity, Boolean admin) {
		super();
		this.name = name;
		this.kind = kind;
		this.groups = groups;
		this.server = server;
		this.pending = pending;
		this.servers = servers;
		this.last_activity = last_activity;
		this.admin = admin;
	}
	
	public HubUserResponse() {
		super();
	}
	
	public HubUserResponse(String name, String kind, List<String> groups, String server, String pending, Object servers,
			ZonedDateTime last_activity, String created, Boolean admin) {
		super();
		this.name = name;
		this.kind = kind;
		this.groups = groups;
		this.server = server;
		this.pending = pending;
		this.servers = servers;
		this.last_activity = last_activity;
		this.created = created;
		this.admin = admin;
	}

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getKind() {
		return kind;
	}
	
	public void setKind(String kind) {
		this.kind = kind;
	}
	
	public List<String> getGroups() {
		return groups;
	}
	
	public void setGroups(List<String> groups) {
		this.groups = groups;
	}
	
	public String getServer() {
		return server;
	}
	
	public void setServer(String server) {
		this.server = server;
	}
	
	public String getPending() {
		return pending;
	}
	
	public void setPending(String pending) {
		this.pending = pending;
	}
	
	public Object getServers() {
		return servers;
	}
	
	public void setServers(Object servers) {
		this.servers = servers;
	}
	
	public ZonedDateTime getLast_activity() {	
		return last_activity;
	}
	
	public void setLast_activity(String last_activity) {
		
		//DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT.withLocale(Locale.ENGLISH);//.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS000");
		ZonedDateTime date = ZonedDateTime.parse(last_activity);
		this.last_activity = date;
	}
	
	public String getCreated() {
		return created;
	}
	
	public void setCreated(String created) {
		//LocalDateTime date = LocalDateTime.parse(created);
		this.created = created;
	}
	
	public Boolean getAdmin() {
		return admin;
	}
	
	public void setAdmin(Boolean admin) {
		this.admin = admin;
	}
	

	public String getAuth_state() {
		return auth_state;
	}

	public void setAuth_state(String auth_state) {
		this.auth_state = auth_state;
	}

	@Override
	public String toString() {
		return "HubUserResponse [name=" + name + ", kind=" + kind + ", groups=" + groups + ", server=" + server
				+ ", pending=" + pending + ", servers=" + servers + ", last_activity=" + last_activity + ", created="
				+ created + ", admin=" + admin + "]";
	}
	
	
}
