package gr.helix.lab.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.model.security.User;
import gr.helix.core.common.repository.AccountRepository;
import gr.helix.lab.web.domain.WhiteListEntryEntity;
import gr.helix.lab.web.domain.WhiteListEntryKernelEntity;
import gr.helix.lab.web.domain.WhiteListEntryRoleEntity;
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

        if (entry != null) {
            // Grant roles from the white list entry
            for (final WhiteListEntryRoleEntity role : entry.getRoles()) {
                account.grant(role.getRole(), null);
            }
            // Assign kernels from the white list entry
            for (final WhiteListEntryKernelEntity kernel : entry.getKernels()) {
                account.grantKernel(kernel.getKernel(), kernel.getGrantedBy());
            }
        }

        // Always grant the default role
        if (!account.hasRole(EnumRole.ROLE_USER)) {
            account.grant(EnumRole.ROLE_USER, null);
        }

        this.accountRepository.save(account);

        return new User(account.toDto(), account.getPassword());
    }

}

