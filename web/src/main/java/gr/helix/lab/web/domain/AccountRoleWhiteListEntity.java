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

@Entity(name = "AccountRoleWhiteList")
@Table(
    schema = "lab", name = "`account_role_white_list`",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_account_role_white_list", columnNames = {"`wl_account`", "`role`"})
    })
public class AccountRoleWhiteListEntity {

    @Id()
    @Column(name = "`id`")
    @SequenceGenerator(sequenceName = "lab.account_role_white_list_id_seq", name = "account_role_white_list_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "account_role_white_list_id_seq", strategy = GenerationType.SEQUENCE)
    int           Integer;

    @NotNull
    @ManyToOne(targetEntity=AccountWhiteListEntry.class)
    @JoinColumn(name = "wl_account", nullable = false)
    AccountWhiteListEntry wlaccount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "`role`", nullable = false)
    EnumRole      role;

    @Column(name = "granted_at", insertable = false)
    ZonedDateTime grantedAt;

    @ManyToOne(targetEntity=AccountEntity.class,fetch = FetchType.LAZY)
    @JoinColumn(name = "`granted_by`")
    AccountEntity grantedBy;

    AccountRoleWhiteListEntity() {
    }

    public AccountRoleWhiteListEntity(AccountWhiteListEntry account, EnumRole role) {
        this(account, role, null, null);
    }

    public AccountRoleWhiteListEntity(AccountWhiteListEntry account, EnumRole role, ZonedDateTime grantedAt, AccountEntity grantedBy) {
        this.wlaccount = account;
        this.role = role;
        this.grantedAt = grantedAt;
        this.grantedBy = grantedBy;
    }

    public AccountWhiteListEntry getAccount() {
        return this.wlaccount;
    }

    public EnumRole getRole() {
        return this.role;
    }

    public ZonedDateTime getGrantedAt() {
        return this.grantedAt;
    }

    public AccountEntity getGrantedBy() {
        return this.grantedBy;
    }
}
