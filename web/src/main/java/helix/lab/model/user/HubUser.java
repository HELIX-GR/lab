package helix.lab.model.user;

import java.util.List;

public class HubUser {

	private String name;
	
	private boolean admin=false;
	
	private List<String> groups;
	
	private String server= null;

	public HubUser(String name, boolean admin, List<String> groups, String server) {
		super();
		this.name = name;
		this.admin = admin;
		this.groups = groups;
		this.server = server;
	}
	
	
	
	
	
	
	
	
	
	
}
