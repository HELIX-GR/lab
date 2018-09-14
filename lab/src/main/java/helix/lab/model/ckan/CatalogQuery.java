package helix.lab.model.ckan;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;

import helix.lab.model.ckan.CkanCatalogQuery;

//@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "catalog")
//@JsonSubTypes({ @Type(name = "CKAN", value = CkanCatalogQuery.class), })
public class CatalogQuery {

	private int pageIndex;

	private int pageSize;

	private String term;

	public int getPageIndex() {
		return this.pageIndex;
	}

	public void setPageIndex(int pageIndex) {
		if (pageIndex < 0) {
			pageIndex = 0;
		}
		this.pageIndex = pageIndex;
	}

	public int getPageSize() {
		return this.pageSize;
	}

	public void setPageSize(int pageSize) {
		if (pageSize > 100) {
			pageSize = 100;
		}
		this.pageSize = pageSize;
	}

	public String getTerm() {
		return this.term;
	}

	public void setTerm(String term) {
		this.term = term;
	}

	@JsonIgnore()
	public boolean isEmpty() {
		return StringUtils.isBlank(this.term);
	}

	@Override
	public String toString() {
		return "CatalogQuery [pageIndex=" + pageIndex + ", pageSize=" + pageSize + ", term=" + term + "]";
	}

}
