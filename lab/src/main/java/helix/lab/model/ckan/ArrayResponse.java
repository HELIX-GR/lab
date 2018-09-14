package helix.lab.model.ckan;

import java.util.List;

public class ArrayResponse<T> extends Response {

    private List<T> result;

    public List<T> getResult() {
        return this.result;
    }

    public void setResult(List<T> result) {
        this.result = result;
    }

}
