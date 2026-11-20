package com.retailmax.retailmaxcrm.service;

import com.retailmax.retailmaxcrm.repository.CustomerRepository;
import com.retailmax.retailmaxcrm.repository.OrderRepository;
import com.retailmax.retailmaxcrm.repository.ProductRepository;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    public static final int LOW_STOCK_LIMIT = 10;

    private final CustomerRepository customers;
    private final ProductRepository products;
    private final OrderRepository orders;

    public DashboardService(CustomerRepository c, ProductRepository p, OrderRepository o) {
        this.customers = c;
        this.products = p;
        this.orders = o;
    }

    public Map<String, Object> summary() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("customers", customers.count());
        m.put("products", products.count());
        m.put("orders", orders.count());
        m.put("revenue", orders.totalRevenue());
        m.put("lowStock", products.countByStockLessThan(LOW_STOCK_LIMIT));
        return m;
    }
}
