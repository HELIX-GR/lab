package helix.lab.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import helix.lab.model.user.Account;

@Service
public class DefaultUserDetailsService implements UserDetailsService
{
    public static class Details implements UserDetails
    {
        private static final long serialVersionUID = 1L;

        private final Account account;

        private final String password;

        public Details(Account account, String password)
        {
            this.account = account;
            this.password = password;
        }

   

        public Integer getId() {
            return account.getId();
        }

        @Override
        public String getPassword()
        {
            return password;
        }

        @Override
        public String getUsername()
        {
            return account.getUsername();
        }

        @Override
        public boolean isAccountNonExpired()
        {
            return account.isActive();
        }

        @Override
        public boolean isAccountNonLocked()
        {
            return !account.isBlocked();
        }

        @Override
        public boolean isCredentialsNonExpired()
        {
            return account.isActive();
        }

        @Override
        public boolean isEnabled()
        {
            return account.isActive();
        }

        public String getLang() {
            return account.getLang();
        }



		@Override
		public Collection<? extends GrantedAuthority> getAuthorities() {
			// TODO Auto-generated method stub
			return null;
		}
    }

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		return null;
	}

    
}