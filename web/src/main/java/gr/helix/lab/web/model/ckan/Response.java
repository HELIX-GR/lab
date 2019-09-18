package gr.helix.lab.web.model.ckan;

public abstract class Response {

    private boolean success;

    public boolean isSuccess() {
        return this.success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

}
