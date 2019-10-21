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

import gr.helix.core.common.domain.HubKernelEntity;

@Entity(name = "HubServerKernel")
@Table(schema = "lab", name = "`hub_server_kernel`")
public class HubServerKernelEntity {

    @Id
    @Column(name = "`id`", updatable = false)
    @SequenceGenerator(
        schema = "lab",
        sequenceName = "hub_server_kernel_id_seq",
        name = "hub_server_kernel_id_seq",
        allocationSize = 1
    )
    @GeneratedValue(generator = "hub_server_kernel_id_seq", strategy = GenerationType.SEQUENCE)
    int id;

    @NotNull
    @ManyToOne(targetEntity = HubServerEntity.class)
    @JoinColumn(name = "hub_server", nullable = false)
    HubServerEntity server;

    @NotNull
    @ManyToOne(targetEntity = HubKernelEntity.class)
    @JoinColumn(name = "hub_kernel", nullable = false)
    HubKernelEntity kernel;


    public HubServerEntity getServer() {
        return this.server;
    }

    public void setServer(HubServerEntity server) {
        this.server = server;
    }

    public HubKernelEntity getKernel() {
        return this.kernel;
    }

    public void setKernel(HubKernelEntity kernel) {
        this.kernel = kernel;
    }

    public int getId() {
        return this.id;
    }

}
