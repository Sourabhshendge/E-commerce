package com.SBS.E_commerce.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int imageId;

    private String fileName;

    private String fileType;

    private String url;   // ✅ new field

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}

