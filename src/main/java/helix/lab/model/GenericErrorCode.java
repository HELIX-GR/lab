package helix.lab.model;

// Copied from package eu.slipo.workbench.common.model;

import com.fasterxml.jackson.annotation.JsonCreator;

import gr.helix.core.common.model.ErrorCode;

/**
 * A generic {@link ErrorCode} that simply holds a key. 
 * <p>
 * This is basically useful as a deserializer of an {@link ErroCode} of an 
 * unknown concrete class.
 */
public class GenericErrorCode implements ErrorCode
{
    private final String key;
    
    @JsonCreator
    public GenericErrorCode(String key)
    {
        this.key = key;
    }
    
    @Override
    public String key()
    {
        return key;
    }
}
