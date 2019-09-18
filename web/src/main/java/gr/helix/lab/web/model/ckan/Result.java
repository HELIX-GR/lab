package gr.helix.lab.web.model.ckan;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Result<T> {

    @JsonProperty("count")
    private int                   count;

    @JsonProperty("sort")
    private String                sort;

    @JsonProperty("facets")
    private FacetCollection       facets;

    @JsonProperty("results")
    private List<T>               results;

    @JsonProperty("search_facets")
    private SearchFacetCollection searchFacets;

    public int getCount() {
        return this.count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public String getSort() {
        return this.sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public FacetCollection getFacets() {
        return this.facets;
    }

    public void setFacets(FacetCollection facets) {
        this.facets = facets;
    }

    public List<T> getResults() {
        return this.results;
    }

    public void setResults(List<T> results) {
        this.results = results;
    }

    public SearchFacetCollection getSearchFacets() {
        return this.searchFacets;
    }

    public void setSearchFacets(SearchFacetCollection searchFacets) {
        this.searchFacets = searchFacets;
    }

}
