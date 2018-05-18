package helix.lab;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity 
@Table(name ="groups", schema= "helix-lab")
public class LabGroups {
	@Id @GeneratedValue(strategy=  GenerationType.SEQUENCE, generator="group_id_seq")
	@SequenceGenerator( sequenceName = "helix-lab.group_id_seq", name = "group_id_seq", allocationSize = 1)
	private  int id;
	@Column(unique=true)
	private String name;
	
		
	public LabGroups() {
		super();
	}
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	
}
