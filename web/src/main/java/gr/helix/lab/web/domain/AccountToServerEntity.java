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

@Entity(name = "AccountToServerEntity")
@Table(
    schema = "lab", name = "account_to_server",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_account_to_server_server_url", columnNames = {"`server_url`"}),
    })
public class AccountToServerEntity {

	@Id
    @Column(name = "`id`", updatable = false)
    @SequenceGenerator(sequenceName = "lab.account_to_server_id_seq", name = "account_to_server_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "account_to_server_id_seq", strategy = GenerationType.SEQUENCE)
    Integer id;

	@Column(name = "`name`")
    String name;
	
	@NotNull
    @ManyToOne(targetEntity=AccountEntity.class)
    @JoinColumn(name = "account", nullable = false)
    AccountEntity account;
	
	@NotNull
    @ManyToOne(targetEntity=HubServerEntity.class)
    @JoinColumn(name = "server_id", nullable = false)
	HubServerEntity hub_server;
	
	@Column(name = "`server_url`")
    String url;
	
	@Column(name = "`started_at`",insertable = false)
    ZonedDateTime startedAt;
	
	@Column(name = "`state`")
	String state;

	public AccountToServerEntity() {
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public AccountEntity getAccount() {
		return account;
	}

	public void setAccount(AccountEntity account) {
		this.account = account;
	}

	public HubServerEntity getHubServer() {
		return hub_server;
	}

	public void setHubServer(HubServerEntity hubServer) {
		this.hub_server = hubServer;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public ZonedDateTime getStartedAt() {
		return startedAt;
	}

	public void setStartedAt(ZonedDateTime startedAt) {
		this.startedAt = startedAt;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public AccountToServerEntity(String name, @NotNull AccountEntity account, @NotNull HubServerEntity hubServer,
			String url) {
		super();
		this.name = name;
		this.account = account;
		this.hub_server = hubServer;
		this.url = url;
	}
	
	

}
