package helix.lab.model.ckan;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CkanCatalogQuery extends CatalogQuery {

    private FacetQuery facets = null;

    public FacetQuery getFacets() {
        return this.facets;
    }

    public void setFacets(FacetQuery facets) {
        this.facets = facets;
    }

    public static class FacetQuery {

        @JsonProperty("formats")
        private List<String> formats;

        @JsonProperty("groups")
        private List<String> groups;

        @JsonProperty("licenses")
        private List<String> licenses;

        @JsonProperty("organizations")
        private List<String> organizations;

        @JsonProperty("tags")
        private List<String> tags;

        public List<String> getFormats() {
            return this.formats;
        }

        public void setFormats(List<String> formats) {
            this.formats = formats;
        }

        public List<String> getGroups() {
            return this.groups;
        }

        public void setGroups(List<String> groups) {
            this.groups = groups;
        }

        public List<String> getLicenses() {
            return this.licenses;
        }

        public void setLicenses(List<String> licenses) {
            this.licenses = licenses;
        }

        public List<String> getOrganizations() {
            return this.organizations;
        }

        public void setOrganizations(List<String> organizations) {
            this.organizations = organizations;
        }

        public List<String> getTags() {
            return this.tags;
        }

        public void setTags(List<String> tags) {
            this.tags = tags;
        }

    }

}
