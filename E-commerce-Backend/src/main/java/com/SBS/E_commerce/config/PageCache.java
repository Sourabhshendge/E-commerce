package com.SBS.E_commerce.config;
import java.io.Serializable;
import java.util.List;

public class PageCache<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<T> content;
    private long totalElements;
    private int pageNumber;
    private int pageSize;

    public PageCache() {}

    public PageCache(List<T> content, long totalElements, int pageNumber, int pageSize) {
        this.content = content;
        this.totalElements = totalElements;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }

    // getters & setters
    public List<T> getContent() { return content; }
    public void setContent(List<T> content) { this.content = content; }
    public long getTotalElements() { return totalElements; }
    public void setTotalElements(long totalElements) { this.totalElements = totalElements; }
    public int getPageNumber() { return pageNumber; }
    public void setPageNumber(int pageNumber) { this.pageNumber = pageNumber; }
    public int getPageSize() { return pageSize; }
    public void setPageSize(int pageSize) { this.pageSize = pageSize; }
}
