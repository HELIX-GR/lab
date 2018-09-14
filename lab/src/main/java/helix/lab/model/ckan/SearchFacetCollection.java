package helix.lab.model.ckan;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SearchFacetCollection {

    @JsonProperty("license_id")
    private SearchFacetGroup licenses;

    @JsonProperty("organization")
    private SearchFacetGroup organizations;

    @JsonProperty("groups")
    private SearchFacetGroup groups;

    @JsonProperty("res_format")
    private SearchFacetGroup formats;

    @JsonProperty("tags")
    private SearchFacetGroup tags;

    public SearchFacetGroup getLicenses() {
        return this.licenses;
    }

    public void setLicenses(SearchFacetGroup licenses) {
        this.licenses = licenses;
    }

    public SearchFacetGroup getOrganizations() {
        return this.organizations;
    }

    public void setOrganizations(SearchFacetGroup organizations) {
        this.organizations = organizations;
    }

    public SearchFacetGroup getGroups() {
        return this.groups;
    }

    public void setGroups(SearchFacetGroup groups) {
        this.groups = groups;
    }

    public SearchFacetGroup getFormats() {
        return this.formats;
    }

    public void setFormats(SearchFacetGroup formats) {
        this.formats = formats;
    }

    public SearchFacetGroup getTags() {
        return this.tags;
    }

    public void setTags(SearchFacetGroup tags) {
        this.tags = tags;
    }

    public static class SearchFacetGroup {

        private List<SearchFacetItem> items;

        private String                title;

        public List<SearchFacetItem> getItems() {
            return this.items;
        }

        public void setItems(List<SearchFacetItem> items) {
            this.items = items;
        }

        public String getTitle() {
            return this.title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

    }

    public static class SearchFacetItem {

        private int    count;

        @JsonProperty("display_name")
        private String displayName;

        private String name;

        public int getCount() {
            return this.count;
        }

        public void setCount(int count) {
            this.count = count;
        }

        public String getDisplayName() {
            return this.displayName;
        }

        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }

        public String getName() {
            return this.name;
        }

        public void setName(String name) {
            this.name = name;
        }

    }

}
