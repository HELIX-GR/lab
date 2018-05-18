package helix.lab.model.user;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * A simple DTO object for AccountEntity
 */
public class Account implements Serializable
{
    private static final long serialVersionUID = 1L;

    private Integer id;

    private String username;
    
    private String email;
    
    private String givenName;
 
    private String familyName;
    
    private String lang;
    
    private boolean active = true;
    
    private boolean blocked = false;
    
    private ZonedDateTime registeredAt;
    
    
    private Account() {}
    
    public Account(String username, String email)
    {
        this.username = username;
        this.email = email;
    }
    
    public Account(Integer id, String username, String email)
    {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    public Integer getId()
    {
        return id;
    }

    public void setId(int id)
    {
        this.id = id;
    }

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public String getGivenName()
    {
        return givenName;
    }

    public void setGivenName(String givenName)
    {
        this.givenName = givenName;
    }

    public String getFamilyName()
    {
        return familyName;
    }

    public void setFamilyName(String familyName)
    {
        this.familyName = familyName;
    }

    public String getLang()
    {
        return lang;
    }

    public void setLang(String lang)
    {
        this.lang = lang;
    }

    @JsonIgnore
    public boolean isActive()
    {
        return active;
    }

    public void setActive(boolean active)
    {
        this.active = active;
    }

    @JsonIgnore
    public boolean isBlocked()
    {
        return blocked;
    }

    public void setBlocked(boolean blocked)
    {
        this.blocked = blocked;
    }

   
    public ZonedDateTime getRegisteredAt()
    {
        return registeredAt;
    }
    
    public void setRegisteredAt(ZonedDateTime registeredAt)
    {
        this.registeredAt = registeredAt;
    }

    @Override
    public String toString()
    {
        return String.format(
            "Account [id=%s, username=%s, email=%s, givenName=%s, familyName=%s, lang=%s, active=%s, blocked=%s, registeredAt=%s]",
            id, username, email, givenName, familyName, lang, active, blocked, registeredAt);
    }
    
    
}