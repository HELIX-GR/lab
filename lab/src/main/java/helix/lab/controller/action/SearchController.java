package helix.lab.controller.action;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.model.BasicErrorCode;
import gr.helix.core.common.model.RestResponse;
import helix.lab.model.ckan.CkanCatalogQuery;
import helix.lab.model.ckan.Package;
import helix.lab.service.SearchService;

@RestController
@RequestMapping(produces = "application/json")
public class SearchController {

    private static final Logger logger = LoggerFactory.getLogger(SearchController.class);

    @Autowired
    public SearchService        searchService;

    @RequestMapping(value = "/action/ckan/query", method = RequestMethod.GET)
    public RestResponse<?> getData(@RequestParam String search) {
        try {
            return RestResponse.result(this.searchService.queryData(search));
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

    @RequestMapping(value = "/action/ckan/query", method = RequestMethod.POST)
    public RestResponse<?> getData(@RequestBody CkanCatalogQuery query) {
        try {
            return RestResponse.result(this.searchService.queryData(query));
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

    @RequestMapping(value = "/action/ckan/package/{id}", method = RequestMethod.GET)
    public RestResponse<?> getDataset(@PathVariable String id) {
        try {
            final Package result = this.searchService.getDataset(id);
            return RestResponse.result(result);
        } catch (final Exception ex) {
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

}
