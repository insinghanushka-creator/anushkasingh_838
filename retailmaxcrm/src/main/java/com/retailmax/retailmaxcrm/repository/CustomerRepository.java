package com.retailmax.retailmaxcrm.repository;

import com.retailmax.retailmaxcrm.entity.Customer;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrCityContainingIgnoreCase(
            String name, String email, String city);
}
