package com.retailmax.retailmaxcrm.service;

import com.retailmax.retailmaxcrm.entity.Product;
import com.retailmax.retailmaxcrm.exception.ResourceNotFoundException;
import com.retailmax.retailmaxcrm.repository.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> findAll(String q) {
        if (q == null || q.isBlank()) return repo.findAll();
        return repo.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(q, q);
    }

    public Product get(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product " + id + " not found"));
    }

    public Product create(Product p) {
        p.setId(null);
        return repo.save(p);
    }

    public Product update(Long id, Product in) {
        Product p = get(id);
        p.setName(in.getName());
        p.setSku(in.getSku());
        p.setCategory(in.getCategory());
        p.setPrice(in.getPrice());
        p.setStock(in.getStock());
        return repo.save(p);
    }

    public void delete(Long id) {
        repo.delete(get(id));
    }
}
