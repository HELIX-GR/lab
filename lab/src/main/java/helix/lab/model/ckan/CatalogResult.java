package helix.lab.model.ckan;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import gr.helix.core.common.model.Error;

public class CatalogResult<T> {

    private int               count;

    private int               pageIndex;

    private int               pageSize;

    private List<T>           results;

    private final List<Error> errors = new ArrayList<Error>();

    public int getCount() {
        return this.count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    @JsonProperty()
    public int getPageIndex() {
        return this.pageIndex;
    }

    @JsonIgnore()
    public void setPageIndex(int pageIndex) {
        this.pageIndex = pageIndex;
    }

    @JsonProperty()
    public int getPageSize() {
        return this.pageSize;
    }

    @JsonIgnore()
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public List<T> getResults() {
        return this.results;
    }

    public void setResults(List<T> results) {
        this.results = results;
    }

    public List<Error> getErrors() {
        return this.errors;
    }

    public static <C> CatalogResult<C> empty(int pageIndex, int pageSize) {
        final CatalogResult<C> result = new CatalogResult<C>();
        result.count = 0;
        result.pageIndex = pageIndex;
        result.pageSize = pageSize;
        result.results = new ArrayList<C>();
        return result;
    }

}
