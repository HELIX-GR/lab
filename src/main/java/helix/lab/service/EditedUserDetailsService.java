package helix.lab.service;

import org.springframework.security.core.userdetails.UserDetailsService;

import gr.helix.core.common.domain.AccountEntity;
import helix.lab.model.security.User;

public interface EditedUserDetailsService extends UserDetailsService{
	
	
    public User createUser(AccountEntity a);

	

}
