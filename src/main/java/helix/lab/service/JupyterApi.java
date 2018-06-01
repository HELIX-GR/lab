package helix.lab.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.Iterator;
import java.util.Map;

import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.HttpClients;

import org.springframework.http.MediaType;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import helix.lab.HubUserCreate;



public class JupyterApi {
	

	
	public JupyterApi() {
	
	}

	

	public Object api_request(String path, String method, HubUserCreate query) {
		ObjectMapper mapper = new ObjectMapper();
		HttpURLConnection con;

	try {
		URL url = new URL("http://192.168.10.163:8081/hub/api/"+path);
		con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod(method);
		con.setRequestProperty ("Authorization", "token d53abbe07ec94f23811fd6f70544621a");
		if (method=="POST") {	
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
		Iterator<Map.Entry<String, JsonNode>> values = actualObj.fields();

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
		}
		//==================================================================
		
		
		return actualObj;

	} catch (IOException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    return null;

	}
	}
	
	
	
	public void Apache_request(String path, String title) throws Exception {

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
    }
}
