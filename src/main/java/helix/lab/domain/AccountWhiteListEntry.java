package helix.lab.domain;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.NaturalId;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.model.EnumRole;


@Entity(name = "account_white_list")
@Table(
	    schema = "helix_lab", name = "account_white_list",
	    uniqueConstraints = {
	       // @UniqueConstraint(name = "uq_account_username", columnNames = {"`server_url`"}),
	        @UniqueConstraint(name = "uq_account_email", columnNames = {"`email`"}),
	    })
public class AccountWhiteListEntry {

	@Id()
	@Column(name = "id")
	@SequenceGenerator(sequenceName = "account_white_list_id_seq", name = "account_white_list_id_seq", allocationSize = 1, initialValue = 1)
	@GeneratedValue(generator = "account_white_list_id_seq", strategy = GenerationType.SEQUENCE)
	private int id;


	@Column(name = "account_id", nullable = true)
	private int account;

	@Basic()
	private String username;
	
	@NotNull
	@NaturalId
	@Email
	@Column(name = "`email`", nullable = false)
	private String email;

	
	@Column(name = "`registered_on`",insertable = false)
    ZonedDateTime registeredOn;
	
	
	@Basic()
	private String firstname;

	@Basic()
	private String lastname;

	@OneToMany(targetEntity=AccountRoleWhiteListEntity.class,mappedBy = "wlaccount", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    List<AccountRoleWhiteListEntity> roles   = new ArrayList<>();

	
	public AccountWhiteListEntry() {

	}

	
	
	public AccountWhiteListEntry(String email) {
		this();
		this.email = email;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getAccount() {
		return account;
	}

	public void setAccount(int account) {
		this.account = account;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public ZonedDateTime getRegisteredOn() {
		return registeredOn;
	}

	public void setRegisteredOn(ZonedDateTime registeredOn) {
		this.registeredOn = registeredOn;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public Set<EnumRole> getRoles() {
        final EnumSet<EnumRole> r = EnumSet.noneOf(EnumRole.class);
        for (final AccountRoleWhiteListEntity ar : this.roles) {
            r.add(ar.role);
        }
        return r;
    }

    public boolean hasRole(EnumRole role) {
        for (final AccountRoleWhiteListEntity ar : this.roles) {
            if (role == ar.role) {
                return true;
            }
        }
        return false;
    }

    public AccountRoleWhiteListEntity grant(EnumRole role, AccountEntity grantedBy) {
        if (!this.hasRole(role)) {
        	AccountRoleWhiteListEntity arwle =new AccountRoleWhiteListEntity(this, role, null, grantedBy);
            this.roles.add(arwle);
            return arwle;
        }
        return null;
    }

    public void revoke(EnumRole role) {
    	AccountRoleWhiteListEntity target = null;
        for (final AccountRoleWhiteListEntity ar : this.roles) {
            if (role == ar.role) {
                target = ar;
                break;
            }
        }
        if (target != null) {
            this.roles.remove(target);
        }
    }


}