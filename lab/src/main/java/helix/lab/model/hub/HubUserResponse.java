package helix.lab.model.hub;

import java.time.LocalDateTime;
import java.util.List;

public class HubUserResponse {

	
	String name;
	String kind;
	List<String> groups;
	String server;
	String pending;
	Object servers;
	LocalDateTime last_activity;
	Boolean admin;
	public HubUserResponse(String name, String kind, List<String> groups, String server, String pending, Object servers,
			LocalDateTime last_activity, Boolean admin) {
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
	public LocalDateTime getLast_activity() {	
		return last_activity;
	}
	public void setLast_activity(String last_activity) {
		
		//DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT.withLocale(Locale.ENGLISH);//.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS000");
		LocalDateTime date = LocalDateTime.parse(last_activity);
		this.last_activity = date;
	}
	public Boolean getAdmin() {
		return admin;
	}
	public void setAdmin(Boolean admin) {
		this.admin = admin;
	}
	@Override
	public String toString() {
		return "HubUserResponse [name=" + name + ", kind=" + kind + ", groups=" + groups + ", server=" + server
				+ ", pending=" + pending + ", servers=" + servers + ", last_activity=" + last_activity + ", admin="
				+ admin + "]";
	}
	
	
	
}
