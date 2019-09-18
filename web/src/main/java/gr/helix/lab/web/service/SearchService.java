package gr.helix.lab.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gr.helix.lab.web.model.ckan.CatalogResult;
import gr.helix.lab.web.model.ckan.CkanCatalogQuery;
import gr.helix.lab.web.model.ckan.Package;

@Service
public class SearchService {

    @Autowired
    private CkanServiceProxy ckanServiceProxy;

    public CatalogResult<?> queryData(String term) {
        final CkanCatalogQuery query = new CkanCatalogQuery();
        query.setPageIndex(0);
        query.setPageSize(10);
        query.setTerm(term);

        return this.ckanServiceProxy.getPackages(query, false);
    }

    public Package getDataset(String id) {
        return this.ckanServiceProxy.getPackage(id);
    }

    public CatalogResult<?> queryData(CkanCatalogQuery query) {
        return this.ckanServiceProxy.getPackages(query, true);
    }

}