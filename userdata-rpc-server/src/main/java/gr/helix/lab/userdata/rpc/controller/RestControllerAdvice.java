package gr.helix.lab.userdata.rpc.controller;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;

import gr.helix.core.common.model.BasicErrorCode;
import gr.helix.core.common.model.RestResponse;

@ControllerAdvice(annotations = { RestController.class })
public class RestControllerAdvice
{
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public @ResponseBody RestResponse<Void> handleException(HttpMessageNotReadableException ex) 
    {
        return RestResponse.error(BasicErrorCode.INPUT_NOT_READABLE, "Cannot parse input: " + ex.getMessage());
    }
}
