package gr.helix.lab.web.controller.action;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.model.BasicErrorCode;
import gr.helix.core.common.model.RestResponse;
import gr.helix.lab.web.model.ckan.CkanCatalogQuery;
import gr.helix.lab.web.model.ckan.Package;
import gr.helix.lab.web.service.SearchService;

@RestController
@RequestMapping(produces = "application/json")
public class SearchController {

    private static final Logger logger = LoggerFactory.getLogger(SearchController.class);

    @Autowired
    public SearchService        searchService;

    @GetMapping(value = "/action/ckan/query")
    public RestResponse<?> findDatasetsByKeyword(@RequestParam String search) {
        try {
            return RestResponse.result(this.searchService.queryData(search));
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

    @PostMapping(value = "/action/ckan/query")
    public RestResponse<?> findDatasets(@RequestBody CkanCatalogQuery query) {
        try {
            return RestResponse.result(this.searchService.queryData(query));
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

    @GetMapping(value = "/action/ckan/package/{id}")
    public RestResponse<?> getDataset(@PathVariable String id) {
        try {
            final Package result = this.searchService.getDataset(id);
            return RestResponse.result(result);
        } catch (final Exception ex) {
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

}
