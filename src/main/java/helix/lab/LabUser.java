package helix.lab;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;


@Entity
public class LabUser {
	
	private @Id @GeneratedValue Long id;
	private String firstName;
	private String lastName;
	@Column(unique=true)
	private String username;
	private String password;

}
