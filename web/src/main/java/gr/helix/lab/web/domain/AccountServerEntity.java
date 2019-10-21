package gr.helix.lab.web.domain;

import java.time.ZonedDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
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
import gr.helix.lab.web.model.admin.ClientServerRegistration;

@Entity(name = "AccountServer")
@Table(
    schema = "lab", name = "account_server",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_account_to_server_server_url", columnNames = {"`server_url`"}),
    }
)
public class AccountServerEntity {

	@Id
	@Column(name = "`id`", updatable = false)
	@SequenceGenerator(
        schema = "lab",
        sequenceName = "account_to_server_id_seq",
        name = "account_to_server_id_seq",
        allocationSize = 1
    )
    @GeneratedValue(generator = "account_to_server_id_seq", strategy = GenerationType.SEQUENCE)
    Integer         id;

    @Column(name = "`name`")
    String          name;

    @NotNull
    @ManyToOne(targetEntity = AccountEntity.class)
    @JoinColumn(name = "account", nullable = false)
    AccountEntity   account;

    @NotNull
    @ManyToOne(targetEntity = HubServerEntity.class)
    @JoinColumn(name = "server_id", nullable = false)
    HubServerEntity server;

    @NotNull
    @ManyToOne(targetEntity = HubKernelEntity.class)
    @JoinColumn(name = "hub_kernel", nullable = false)
    HubKernelEntity kernel;

    /**
     * The URL where the server can be accessed (typically
     * /user/:name/:server.name/)
     */
    @Column(name = "`server_url`")
    String          url;

    @Column(name = "`started_at`", insertable = false)
    ZonedDateTime   startedAt;

    @Column(name = "`state`")
    String          state;

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public AccountEntity getAccount() {
		return this.account;
	}

	public void setAccount(AccountEntity account) {
		this.account = account;
	}

	public HubServerEntity getHubServer() {
		return this.server;
	}

	public void setHubServer(HubServerEntity server) {
		this.server = server;
	}

	public String getUrl() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public ZonedDateTime getStartedAt() {
		return this.startedAt;
	}

	public void setStartedAt(ZonedDateTime startedAt) {
		this.startedAt = startedAt;
	}

	public String getState() {
		return this.state;
	}

    public void setState(String state) {
        this.state = state;
    }

    public void setKernel(HubKernelEntity kernel) {
        this.kernel = kernel;
    }

    public HubKernelEntity getKernel() {
        return this.kernel;
    }

    public ClientServerRegistration toDto() {
        final ClientServerRegistration record = new ClientServerRegistration();

        record.setAccount(this.account.toDto());
        record.setServer(this.server.toDto());
        record.setId(this.id);
        record.setName(this.name);
        record.setStartedAt(this.startedAt);
        record.setState(this.state);
        record.setUrl(this.url);
        record.setKernel(this.kernel.getName());

        return record;
    }

}
