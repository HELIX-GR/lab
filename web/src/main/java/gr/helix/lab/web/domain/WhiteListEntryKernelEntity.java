package gr.helix.lab.web.domain;

import java.time.ZonedDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
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
import gr.helix.core.common.domain.HubKernelEntity;

@Entity(name = "WhiteListEntryKernel")
@Table(
    schema = "lab", name = "`white_list_hub_kernel`",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_pk_white_list_hub_kernel", columnNames = {"`white_list`", "`hub_kernel`"})
    }
)
public class WhiteListEntryKernelEntity {

    @Id
    @Column(name = "`id`", updatable = false)
    @SequenceGenerator(
        schema = "lab",
        sequenceName = "white_list_hub_kernel_id_seq",
        name = "white_list_hub_kernel_id_seq",
        allocationSize = 1
    )
    @GeneratedValue(generator = "white_list_hub_kernel_id_seq", strategy = GenerationType.SEQUENCE)
    int                  id;

    @NotNull
    @ManyToOne(targetEntity = WhiteListEntryEntity.class)
    @JoinColumn(name = "white_list", nullable = false)
    WhiteListEntryEntity entry;

    @ManyToOne(targetEntity = HubKernelEntity.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "`hub_kernel`")
    HubKernelEntity      kernel;

    @ManyToOne(targetEntity = AccountEntity.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "`granted_by`")
    AccountEntity        grantedBy;

    @Column(name = "granted_at", insertable = false)
    ZonedDateTime        grantedAt = ZonedDateTime.now();

    public WhiteListEntryEntity getEntry() {
        return this.entry;
    }

    public void setEntry(WhiteListEntryEntity entry) {
        this.entry = entry;
    }

    public HubKernelEntity getKernel() {
        return this.kernel;
    }

    public void setKernel(HubKernelEntity kernel) {
        this.kernel = kernel;
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

    public ZonedDateTime getGrantedAt() {
        return this.grantedAt;
    }



}
