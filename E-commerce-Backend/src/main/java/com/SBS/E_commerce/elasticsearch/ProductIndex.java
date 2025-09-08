package com.SBS.E_commerce.elasticsearch;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Document(indexName = "products")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductIndex {

    @Id
    private String id;

    @Field(type = FieldType.Text)   // allows full-text search
    private String name;

    @Field(type = FieldType.Double)
    private Double price;

    @Field(type = FieldType.Text)
    private String category;

    // getters & setters
}
