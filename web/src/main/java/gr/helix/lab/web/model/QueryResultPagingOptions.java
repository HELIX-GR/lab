package gr.helix.lab.web.model;

/**
 * Query result pagination options
 */
public class QueryResultPagingOptions extends QueryPagingOptions {

    public int count;

    public QueryResultPagingOptions(int indexPage, int indexSize, int count) {
        this.pageIndex = indexPage;
        this.pageSize = indexSize;
        this.count = count;
    }

}
