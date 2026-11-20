package com.retailmax.retailmaxcrm.repository;

import com.retailmax.retailmaxcrm.entity.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(String name, String category);

    long countByStockLessThan(int threshold);
}
