package helix.lab.model.hub;

import helix.lab.model.HubServerResponse;

public class ServerInfoResponse {

	HubServerResponse hub_server;
	
	String target;

	
	public HubServerResponse getHub_server() {
		return hub_server;
	}



	public void setHub_server(HubServerResponse hub_server) {
		this.hub_server = hub_server;
	}



	public String getTarget() {
		return target;
	}



	public void setTarget(String target) {
		this.target = target;
	}



	public ServerInfoResponse(HubServerResponse hub_server, String target) {
		super();
		this.hub_server = hub_server;
		this.target = target;
	}
	
}
