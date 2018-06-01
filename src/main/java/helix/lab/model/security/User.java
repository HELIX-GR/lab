package helix.lab.model.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.model.user.Account;

public class User implements UserDetails {

    private static final long serialVersionUID = 1L;

    private final Account     account;

    private final String      password;

    public User(Account account, String password) {
        this.account = account;
        this.password = password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        final List<GrantedAuthority> authorities = new ArrayList<>();
        for (final EnumRole role : this.account.getRoles()) {
            authorities.add(new SimpleGrantedAuthority(role.name()));
        }
        return authorities;
    }

    public Integer getId() {
        return this.account.getId();
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.account.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return this.account.isActive();
    }

    @Override
    public boolean isAccountNonLocked() {
        return !this.account.isBlocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return this.account.isActive();
    }

    @Override
    public boolean isEnabled() {
        return this.account.isActive();
    }

    public String getLang() {
        return this.account.getLang();
    }

    public Account getAccount() {
        return this.account;
    }

}
