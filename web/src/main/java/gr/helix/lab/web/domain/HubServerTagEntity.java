package gr.helix.lab.web.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity(name = "HubServerTag")
@Table(schema = "lab", name = "`hub_server_tags`")
public class HubServerTagEntity {

	@Id
	@Column(name = "`id`", updatable = false)
	@SequenceGenerator(
        schema = "lab",
        sequenceName = "hub_server_tags_id_seq",
        name = "hub_server_tags_id_seq",
        allocationSize = 1
    )
    @GeneratedValue(generator = "hub_server_tags_id_seq", strategy = GenerationType.SEQUENCE)
	int id;

    @NotNull
    @ManyToOne(targetEntity=HubServerEntity.class)
    @JoinColumn(name = "hub_server", nullable = false)
    HubServerEntity server;

    @NotNull
    @Column(name = "`tag`", nullable = false)
    String value;

    public HubServerEntity getServer() {
        return this.server;
    }

    public void setServer(HubServerEntity server) {
        this.server = server;
    }

    public String getValue() {
        return this.value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public int getId() {
        return this.id;
    }

    public HubServerTagEntity() {};

	public HubServerTagEntity(HubServerEntity server, String value) {
		this.server = server;
		this.value = value;
	}

}
