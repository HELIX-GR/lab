package helix.lab;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;


@Entity 
@Table(name ="users", schema= "helix-lab")
public class LabUser {
	@Id @GeneratedValue(strategy=  GenerationType.SEQUENCE, generator="user_id_seq")
	@SequenceGenerator( sequenceName = "helix-lab.user_id_seq", name = "user_id_seq", allocationSize = 1)
	private  int id;
	@Column(unique=true)
	private String name;
	private boolean admin;
	private Timestamp last_activity;
	@Column(unique=true)
	private String cookie_id;
	private String state;
	
	public LabUser() {
		super();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isAdmin() {
		return admin;
	}

	public void setAdmin(boolean admin) {
		this.admin = admin;
	}

	public Timestamp getLast_activity() {
		return last_activity;
	}

	public void setLast_activity(Timestamp last_activity) {
		this.last_activity = last_activity;
	}

	public String getCookie_id() {
		return cookie_id;
	}

	public void setCookie_id(String cookie_id) {
		this.cookie_id = cookie_id;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}
	
	
	

}
