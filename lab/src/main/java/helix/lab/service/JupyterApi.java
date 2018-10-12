package helix.lab.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import helix.lab.model.admin.HubServerEntity;
import helix.lab.model.hub.HubUserResponse;
import helix.lab.model.user.HubUserCreate;



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
	
	
	public boolean delete_user_server(HubServerEntity hub, String path) throws IOException {
		HttpURLConnection con;

	try {
		URL url = new URL(hub.getUrl()+"/hub/api/"+path);
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
	
	//This code is for testing

	/*public void Apache_request(String path, String title) throws Exception {

        HttpClient httpClient = HttpClients.createDefault();

        URI uri = new URIBuilder()
            .setScheme("http")
            .setHost("http://192.168.10.163:8081/hub/api/")
            .setPort(8081)
            .setPath(String.format("/hub/api/", path))
            .build();

        String json = "{\"featureType\":{\"name\":\"%s\",\"title\":\"%s\",\"nativeCRS\":\"EPSG:4326\",\"recalculate\":\"nativebbox,latlonbbox\"}}";
      //  StringEntity entity = new StringEntity(String.format(json, tableName, title));

       // String auth = config.getUsername() + ":" + config.getPassword();
      //  byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(Charset.forName("ISO-8859-1")));

        HttpUriRequest request = RequestBuilder.post(uri)
            .addHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
            .addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE)
            .addHeader(HttpHeaders.AUTHORIZATION, "token " + new String("8f972f5d7d5244fda516f2e19298f3a4")).build();

        HttpResponse response = httpClient.execute(request);
        if (response.getStatusLine().getStatusCode() != 201) {
            throw new RuntimeException("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
        }
    }*/
}
