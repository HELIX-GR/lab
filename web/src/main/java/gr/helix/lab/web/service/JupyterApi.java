package gr.helix.lab.web.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import gr.helix.lab.web.domain.HubServerEntity;
import gr.helix.lab.web.model.hub.HubUserResponse;
import gr.helix.lab.web.model.user.HubUserCreate;



public class JupyterApi {
	

	
	public JupyterApi() {
	
	}

	

	public Object api_request(HubServerEntity hub, String path, String method, HubUserCreate query) throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		HttpURLConnection con;

	try {
		URL url = new URL(hub.getUrl()+"/hub/api/"+path);
		System.out.println(url);
		con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod(method);
		con.setRequestProperty ("Authorization", "token "+hub.getAdmin_token());
		if (method=="POST" ) {	
			String message = mapper.writeValueAsString(query);
		  	System.out.println(message.toString());
		    con.setRequestProperty("Content-Type", "application/json");
			con.setDoOutput(true);
			   //Send request
			con.connect();
			OutputStream os =con.getOutputStream();
			os.write(message.toString().getBytes("UTF-8"));
			  //clean up
			os.flush();
		    os.close ();			
			
		}
		int responseCode = con.getResponseCode();
		
		//-----------------Debug prints----------------------------------
		System.out.println("\nSending "+method+" request to URL : " + url);
		System.out.println("Response Code : " + responseCode);
		System.out.println("body : " + query);

		BufferedReader in = new BufferedReader(
		        new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();

		//print result
		System.out.println(response.toString());
		
		
		//-----------------------------------------------------
		JsonNode actualObj = mapper.readTree(response.toString());
	/*	Iterator<Map.Entry<String, JsonNode>> values = actualObj.fields();

		Object field = null;
		while (values.hasNext()){
		    Map.Entry<String, JsonNode> entry = values.next();
		    String key = entry.getKey();
		    JsonNode value = entry.getValue();

		    if(value.canConvertToInt()){
		        // Integer
		        field = value.asInt();
		    }else if(value.isTextual()){
		        // String
		        field = value.asText();
		    }else{
		    	field = value.asText();
		       
		    }
		    System.out.println(key + " => "+ field);
		}*/
		//==================================================================
		
		
		return actualObj;

	} catch (IOException e) {
		System.out.println(e.getMessage());
		throw e;
	    

	}
	}
	

	//---------------------------------------------------------------------------------------
	public HubUserResponse hub_user_info(HubServerEntity hub, String path) throws IOException {
		ObjectMapper objectMapper = new ObjectMapper();
		HttpURLConnection con;

	try {
		URL url = new URL(hub.getUrl()+"/hub/api/"+path);
		con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod("GET");
		con.setRequestProperty ("Authorization", "token "+hub.getAdmin_token());
		
		int responseCode = con.getResponseCode();
		
		//-----------------Debug prints----------------------------------
		System.out.println("\nSending GET request to URL : " + url);
		System.out.println("Response Code : " + responseCode);
		

		BufferedReader in = new BufferedReader(
		        new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();

		//print result
		System.out.println(response.toString());

		HubUserResponse a= objectMapper.readValue(response.toString(), HubUserResponse.class);  

		return a ;

	} catch (IOException e) {
		System.out.println(e.getMessage());
		throw e;
	    

	}
	}
	
	
	public boolean delete_user_server(HubServerEntity hub, String username) throws IOException {
		HttpURLConnection con;

	try {
		URL url = new URL(hub.getUrl()+"/hub/api/users/"+username);
		con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod("DELETE");
		con.setRequestProperty ("Authorization", "token "+hub.getAdmin_token());
		
		int responseCode = con.getResponseCode();
		
		//-----------------Debug prints----------------------------------
		System.out.println("\nSending DELETE request to URL : " + url);
		System.out.println("Response Code : " + responseCode);
		

		BufferedReader in = new BufferedReader(
		        new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();
		if (responseCode< 400) {
			return true;
		}
	} catch (IOException e) {
		System.out.println(e.getMessage());
		throw e;
	    

	}
	return false;
	}
	
	
}
