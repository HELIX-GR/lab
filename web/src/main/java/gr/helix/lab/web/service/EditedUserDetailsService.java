package gr.helix.lab.web.service;

import org.springframework.security.core.userdetails.UserDetailsService;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.lab.web.model.security.User;

public interface EditedUserDetailsService extends UserDetailsService{
	
	
    public User createUser(AccountEntity a);

	

}
