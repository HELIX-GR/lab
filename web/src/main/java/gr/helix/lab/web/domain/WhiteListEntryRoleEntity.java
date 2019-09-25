package gr.helix.lab.web.domain;

import java.time.ZonedDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.model.EnumRole;

@Entity(name = "WhiteListEntryRole")
@Table(
    schema = "lab", name = "`white_list_role`",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_account_role_white_list", columnNames = {"`wl_account`", "`role`"})
    }
)
public class WhiteListEntryRoleEntity {

	@Id
	@Column(name = "`id`", updatable = false)
	@SequenceGenerator(
        schema = "lab",
        sequenceName = "account_role_white_list_id_seq",
        name = "account_role_white_list_id_seq",
        allocationSize = 1
    )
    @GeneratedValue(generator = "account_role_white_list_id_seq", strategy = GenerationType.SEQUENCE)
    int           id;

    @NotNull
    @ManyToOne(targetEntity=WhiteListEntryEntity.class)
    @JoinColumn(name = "wl_account", nullable = false)
    WhiteListEntryEntity entry;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "`role`", nullable = false)
    EnumRole      role;

    @Column(name = "granted_at", insertable = false)
    ZonedDateTime grantedAt;

    @ManyToOne(targetEntity=AccountEntity.class,fetch = FetchType.LAZY)
    @JoinColumn(name = "`granted_by`")
    AccountEntity grantedBy;

    protected WhiteListEntryRoleEntity() {

    }

    public WhiteListEntryRoleEntity(WhiteListEntryEntity account, EnumRole role) {
        this(account, role, null, null);
    }

    public WhiteListEntryRoleEntity(WhiteListEntryEntity entry, EnumRole role, ZonedDateTime grantedAt, AccountEntity grantedBy) {
        this.entry = entry;
        this.role = role;
        this.grantedAt = grantedAt;
        this.grantedBy = grantedBy;
    }

    public WhiteListEntryEntity getEntry() {
        return this.entry;
    }

    public void setEntry(WhiteListEntryEntity entry) {
        this.entry = entry;
    }

    public EnumRole getRole() {
        return this.role;
    }

    public void setRole(EnumRole role) {
        this.role = role;
    }

    public ZonedDateTime getGrantedAt() {
        return this.grantedAt;
    }

    public void setGrantedAt(ZonedDateTime grantedAt) {
        this.grantedAt = grantedAt;
    }

    public AccountEntity getGrantedBy() {
        return this.grantedBy;
    }

    public void setGrantedBy(AccountEntity grantedBy) {
        this.grantedBy = grantedBy;
    }

    public int getId() {
        return this.id;
    }


}
