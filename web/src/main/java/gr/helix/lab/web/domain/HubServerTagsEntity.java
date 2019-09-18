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

@Entity(name = "HubServerTags")
@Table(schema = "lab", name = "`hub_server_tags`")
public class HubServerTagsEntity {

	@Id()
    @Column(name = "`id`")
    @SequenceGenerator(sequenceName = "lab.hub_server_tags_id_seq", name = "hub_server_tags_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "hub_server_tags_id_seq", strategy = GenerationType.SEQUENCE)
    int id;

    @NotNull
    @ManyToOne(targetEntity=HubServerEntity.class)
    @JoinColumn(name = "hub_server", nullable = false)
    HubServerEntity hub_server;

    @NotNull
    @Column(name = "`tag`", nullable = false)
    String tag;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public HubServerEntity getHub_server() {
		return hub_server;
	}

	public void setHub_server(HubServerEntity hub_server) {
		this.hub_server = hub_server;
	}

	public String getTag() {
		return tag;
	}

	public void setTag(String tag) {
		this.tag = tag;
	}

	public HubServerTagsEntity(@NotNull HubServerEntity hub_server, @NotNull String tag) {
		super();
		this.hub_server = hub_server;
		this.tag = tag;
	}
	
	public HubServerTagsEntity() {};
	    
	    
}
