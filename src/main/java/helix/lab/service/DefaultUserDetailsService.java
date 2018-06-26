package helix.lab.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.repository.AccountRepository;
import helix.lab.domain.AccountWhiteListEntry;
import helix.lab.model.security.User;
import helix.lab.repository.AccountWhiteListRepository;

@Service
public class DefaultUserDetailsService implements EditedUserDetailsService {

    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private AccountWhiteListRepository accountWLRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    	System.out.println(username);
        AccountEntity accountEntity = this.accountRepository.findOneByUsername(username);
        if (accountEntity == null) {
        	accountEntity = this.accountRepository.findOneByEmail(username);
        	if (accountEntity == null) {
        		throw new UsernameNotFoundException(username);
        }
        	
        }
        return new User(accountEntity.toDto(), accountEntity.getPassword());
    }

	@Override
	public User createUser(AccountEntity a) {
		AccountWhiteListEntry whitelisted = accountWLRepository.findOneByEmail(a.getEmail());
		
		if (whitelisted==null) {
			a.grant(EnumRole.ROLE_UNREGISTERED, null);
		}else
		{
			for (EnumRole role : whitelisted.getRoles()) {
				a.grant(role, null);//TODO transfer grunted by?
			}
		}
		accountRepository.save(a);
		return new User(a.toDto(), a.getPassword());
	}

    
}

   