package gr.helix.lab.web.domain;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import gr.helix.core.common.model.EnumRole;
import gr.helix.lab.web.model.admin.ClientServer;
import gr.helix.lab.web.model.admin.ClientServerRegistrationRequest;

@Entity(name = "HubServer")
@Table(
    schema = "lab", name = "hub_server",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_hub_server_server_url", columnNames = {"`server_url`"})
    }
)
public class HubServerEntity {

	@Id
	@Column(name = "`id`", updatable = false)
	@SequenceGenerator(
        schema = "lab",
        sequenceName = "server_id_seq",
        name = "server_id_seq",
        allocationSize = 1
    )
    @GeneratedValue(generator = "server_id_seq", strategy = GenerationType.SEQUENCE)
    private Integer          id;

    @Column(name = "`name`")
    private String           name;

    @Column(name = "`description`")
    private String           description;

    @Column(name = "`server_url`")
    private String           url;

    @Column(name = "`available`")
    private Boolean          available;

    @Column(name = "`admin_token`")
    private String           token;

    @Column(name = "`started_at`")
    private ZonedDateTime    startedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "`role_eligible`")
    private EnumRole         eligibleRole;

    @Column(name = "`ram`")
    private long             memory;

    @Column(name = "`vcpu`")
    private int              virtualCores;

    @OneToMany(
        targetEntity = HubServerTagEntity.class,
        mappedBy = "server",
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    List<HubServerTagEntity> tags = new ArrayList<>();

    @OneToMany(
        targetEntity = HubServerKernelEntity.class,
        mappedBy = "server",
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    List<HubServerKernelEntity> kernels = new ArrayList<>();

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getAvailable() {
        return this.available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public ZonedDateTime getStartedAt() {
        return this.startedAt;
    }

    public void setStartedAt(ZonedDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public EnumRole getEligibleRole() {
        return this.eligibleRole;
    }

    public void setEligibleRole(EnumRole eligibleRole) {
        this.eligibleRole = eligibleRole;
    }

    public long getMemory() {
        return this.memory;
    }

    public void setMemory(long memory) {
        this.memory = memory;
    }

    public int getVirtualCores() {
        return this.virtualCores;
    }

    public void setVirtualCores(int virtualCores) {
        this.virtualCores = virtualCores;
    }

    public Integer getId() {
        return this.id;
    }

    public List<HubServerTagEntity> getTags() {
        return this.tags;
    }

    public boolean hasTag(String value) {
        for (final HubServerTagEntity tag : this.tags) {
            if (tag.getValue().equals(value)) {
                return true;
            }
        }
        return false;
    }

    public List<HubServerKernelEntity> getKernels() {
        return this.kernels;
    }

    public boolean hasKernel(String name) {
        for (final HubServerKernelEntity kernel : this.kernels) {
            if (kernel.getKernel().getName().equals(name)) {
                return true;
            }
        }
        return false;
    }

    public HubServerEntity() {

    }

    public void update(ClientServerRegistrationRequest request) {
        this.name = request.getName();
        this.description = request.getDescription();
        this.url = request.getUrl();
        this.available = request.getAvailable();
        this.token = request.getToken();
        this.eligibleRole = request.getEligibleRole();
        this.memory = request.getMemory();
        this.virtualCores = request.getVirtualCores();

        this.tags.clear();
        request.getTags().stream()
            .forEach(tag -> {
                this.tags.add(new HubServerTagEntity(this, tag));
            });
    }

    public HubServerEntity(ClientServerRegistrationRequest request) {
        this.name = request.getName();
        this.description = request.getDescription();
        this.url = request.getUrl();
        this.available = request.getAvailable();
        this.token = request.getToken();
        this.eligibleRole = request.getEligibleRole();
        this.startedAt = ZonedDateTime.now();
        this.memory = request.getMemory();
        this.virtualCores = request.getVirtualCores();

        request.getTags().stream()
            .forEach(tag -> {
                this.tags.add(new HubServerTagEntity(this, tag));
            });
    }

    public ClientServer toDto() {
        final ClientServer record = new ClientServer();

        record.setAvailable(this.available);
        record.setDescription(this.description);
        record.setEligibleRole(this.eligibleRole);
        record.setId(this.id);
        record.setMemory(this.memory);
        record.setName(this.name);
        record.setStartedAt(this.startedAt);
        record.setToken(this.token);
        record.setUrl(this.url);
        record.setVirtualCores(this.virtualCores);

        this.tags.stream().forEach(tag -> record.getTags().add(tag.getValue()));
        this.kernels.stream().forEach(kernel -> record.getKernels().add(kernel.getKernel().getName()));

        return record;
    }

}
