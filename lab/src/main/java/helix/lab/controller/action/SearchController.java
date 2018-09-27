package helix.lab.controller.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.model.BasicErrorCode;
import gr.helix.core.common.model.RestResponse;


import helix.lab.model.ckan.CkanCatalogQuery;
import helix.lab.service.SearchService;

@RestController
@RequestMapping(produces = "application/json")
public class SearchController {

	@Autowired
    public SearchService searchService;


    @RequestMapping(value = "/action/ckan/query", method = RequestMethod.GET)
    public RestResponse<?> getPackages(Authentication authentication, @RequestParam String search) {
        try {
            return RestResponse.result(this.searchService.queryData(search));
        } catch (final Exception ex) {
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

    @RequestMapping(value = "/action/ckan/query", method = RequestMethod.POST)
    public RestResponse<?> getPackages(Authentication authentication, @RequestBody CkanCatalogQuery query) {
        try {
        	System.out.println(query.toString());
            return RestResponse.result(this.searchService.queryData(query));
        } catch (final Exception ex) {
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }


}
