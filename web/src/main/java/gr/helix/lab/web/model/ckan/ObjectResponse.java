package gr.helix.lab.web.model.ckan;

public class ObjectResponse<T> extends Response {

    private boolean success;

    private T       result;

    public T getResult() {
        return this.result;
    }

    public void setResult(T result) {
        this.result = result;
    }

    @Override
    public boolean isSuccess() {
        return this.success;
    }

    @Override
    public void setSuccess(boolean success) {
        this.success = success;
    }

}
