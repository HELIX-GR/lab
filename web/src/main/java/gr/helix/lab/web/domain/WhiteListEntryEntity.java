package gr.helix.lab.web.domain;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.NaturalId;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.model.EnumRole;
import gr.helix.lab.web.model.admin.WhiteListEntry;

@Entity(name = "WhiteListEntry")
@Table(
    schema = "lab", name = "white_list",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_account_white_list_email", columnNames = {"`email`"}),
    }
)
public class WhiteListEntryEntity {


	@Id
	@Column(name = "`id`", updatable = false)
	@SequenceGenerator(
        schema = "lab",
        sequenceName = "account_white_list_id_seq",
        name = "account_white_list_id_seq",
        allocationSize = 1
    )
    @GeneratedValue(generator = "account_white_list_id_seq", strategy = GenerationType.SEQUENCE)
    private int                    id;

    @Basic()
    private String                 username;

    @NotNull
    @NaturalId
    @Email
    @Column(name = "`email`", nullable = false)
    private String                 email;

    @Column(name = "`registered_on`", insertable = false)
    ZonedDateTime                  registeredOn = ZonedDateTime.now();

    @Column(name = "firstname")
    private String                 firstName;

    @Column(name = "lastname")
    private String                 lastName;

    @OneToMany(
        targetEntity = WhiteListEntryRoleEntity.class,
        mappedBy = "entry",
        fetch = FetchType.EAGER,
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    List<WhiteListEntryRoleEntity> roles = new ArrayList<>();

    public WhiteListEntryEntity() {
    }

    public WhiteListEntryEntity(String email) {
        this.email = email;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public ZonedDateTime getRegisteredOn() {
        return this.registeredOn;
    }

    public void setRegisteredOn(ZonedDateTime registeredOn) {
        this.registeredOn = registeredOn;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getId() {
        return this.id;
    }

    public List<WhiteListEntryRoleEntity> getRoles() {
        return this.roles;
    }

    public boolean hasRole(EnumRole role) {
        for (final WhiteListEntryRoleEntity r : this.roles) {
            if (r.getRole() == role) {
                return true;
            }
        }
        return false;
    }

    public void grant(EnumRole role, AccountEntity grantedBy) {
        if (!this.hasRole(role)) {
            final WhiteListEntryRoleEntity r = new WhiteListEntryRoleEntity(this, role, null, grantedBy);
            this.roles.add(r);
        }
    }

    public void revoke(EnumRole role) {
        WhiteListEntryRoleEntity target = null;

        for (final WhiteListEntryRoleEntity r : this.roles) {
            if (r.getRole() == role) {
                target = r;
                break;
            }
        }
        if (target != null) {
            this.roles.remove(target);
        }
    }

    public WhiteListEntry toDto() {
        final WhiteListEntry record = new WhiteListEntry();

        record.setEmail(this.email);
        record.setFirstName(this.firstName);
        record.setId(this.id);
        record.setLastName(this.lastName);
        record.setRegisteredOn(this.registeredOn);

        this.roles.stream().forEach(r -> record.getRoles().add(r.getRole()));

        return record;
    }

}
