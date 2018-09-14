package helix.lab.model.ckan;

public class ObjectResponse<T> extends Response {

    private T result;

    public T getResult() {
        return this.result;
    }

    public void setResult(T result) {
        this.result = result;
    }

}
