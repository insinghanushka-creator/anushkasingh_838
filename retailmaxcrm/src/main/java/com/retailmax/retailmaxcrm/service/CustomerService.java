package com.retailmax.retailmaxcrm.service;

import com.retailmax.retailmaxcrm.entity.Customer;
import com.retailmax.retailmaxcrm.exception.ResourceNotFoundException;
import com.retailmax.retailmaxcrm.repository.CustomerRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    private final CustomerRepository repo;

    public CustomerService(CustomerRepository repo) {
        this.repo = repo;
    }

    public List<Customer> findAll(String q) {
        if (q == null || q.isBlank()) return repo.findAll();
        return repo.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrCityContainingIgnoreCase(q, q, q);
    }

    public Customer get(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer " + id + " not found"));
    }

    public Customer create(Customer c) {
        c.setId(null);
        return repo.save(c);
    }

    public Customer update(Long id, Customer in) {
        Customer c = get(id);
        c.setName(in.getName());
        c.setEmail(in.getEmail());
        c.setPhone(in.getPhone());
        c.setCity(in.getCity());
        c.setSegment(in.getSegment());
        return repo.save(c);
    }

    public void delete(Long id) {
        repo.delete(get(id));
    }
}
