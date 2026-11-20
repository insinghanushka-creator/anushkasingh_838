package com.retailmax.retailmaxcrm.repository;

import com.retailmax.retailmaxcrm.entity.SalesOrder;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<SalesOrder, Long> {

    List<SalesOrder> findAllByOrderByOrderDateDesc();

    List<SalesOrder> findByCustomerIdOrderByOrderDateDesc(Long customerId);

    @Query("select coalesce(sum(o.total), 0) from SalesOrder o where o.status <> 'CANCELLED'")
    BigDecimal totalRevenue();
}
