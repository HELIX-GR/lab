package gr.helix.lab.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.repository.AccountRepository;
import gr.helix.lab.web.domain.WhiteListEntryEntity;
import gr.helix.lab.web.domain.WhiteListEntryRoleEntity;
import gr.helix.lab.web.model.security.User;
import gr.helix.lab.web.repository.WhiteListRepository;

@Service
public class DefaultUserDetailsService implements CustomUserDetailsService {

    @Autowired
    private AccountRepository   accountRepository;

    @Autowired
    private WhiteListRepository whiteListRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        final AccountEntity account = this.accountRepository.findOneByEmail(username);

        if (account == null) {
            throw new UsernameNotFoundException(username);
        }

        return new User(account.toDto(), account.getPassword());
    }

    @Override
    public User createUser(AccountEntity account) {
        final WhiteListEntryEntity entry = this.whiteListRepository.findOneByEmail(account.getEmail());

        if (entry == null) {
            account.grant(EnumRole.ROLE_USER, null);
        } else {
            for (final WhiteListEntryRoleEntity role : entry.getRoles()) {
                account.grant(role.getRole(), null);
            }
        }
        this.accountRepository.save(account);

        return new User(account.toDto(), account.getPassword());
    }

}

