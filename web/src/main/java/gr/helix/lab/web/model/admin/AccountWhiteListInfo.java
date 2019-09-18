package gr.helix.lab.web.model.admin;

import java.util.List;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

import gr.helix.core.common.model.EnumRole;


public class AccountWhiteListInfo {
	private String firstName;
	private String lastName;	
	@NotNull @Email
	private String email;
	private List<EnumRole> roles;

	
	public List<EnumRole> getRoles() {
		return roles;
	}
	public void setRoles(List<EnumRole> roles) {
		this.roles = roles;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}

	


}
