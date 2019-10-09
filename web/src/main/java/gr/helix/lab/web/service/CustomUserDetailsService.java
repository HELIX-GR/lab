package gr.helix.lab.web.service;

import org.springframework.security.core.userdetails.UserDetailsService;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.model.security.User;

public interface CustomUserDetailsService extends UserDetailsService {

    public User createUser(AccountEntity a);

}
