package gr.helix.lab.web.model.admin;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import gr.helix.core.common.model.EnumRole;

public class WhiteListEntry {

    private Integer        id;

    @NotBlank
    private String         firstName;

    @NotBlank
    private String         lastName;

    @NotBlank
    @Email
    private String         email;

    ZonedDateTime          registeredOn;

    @NotNull
    private List<EnumRole> roles   = new ArrayList<EnumRole>();

    @NotEmpty
    private List<String>   kernels = new ArrayList<String>();

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public ZonedDateTime getRegisteredOn() {
        return this.registeredOn;
    }

    public void setRegisteredOn(ZonedDateTime registeredOn) {
        this.registeredOn = registeredOn;
    }

    public List<EnumRole> getRoles() {
        return this.roles;
    }

    public void setRoles(List<EnumRole> roles) {
        this.roles = roles;
    }

    public List<String> getKernels() {
        return this.kernels;
    }

    public void setKernels(List<String> kernels) {
        this.kernels = kernels;
    }

}
