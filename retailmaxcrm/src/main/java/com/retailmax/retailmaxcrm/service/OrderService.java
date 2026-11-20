package com.retailmax.retailmaxcrm.service;

import com.retailmax.retailmaxcrm.dto.OrderRequest;
import com.retailmax.retailmaxcrm.entity.OrderItem;
import com.retailmax.retailmaxcrm.entity.Product;
import com.retailmax.retailmaxcrm.entity.SalesOrder;
import com.retailmax.retailmaxcrm.exception.ResourceNotFoundException;
import com.retailmax.retailmaxcrm.repository.OrderRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private static final Set<String> STATUSES = Set.of("PLACED", "DELIVERED", "CANCELLED");

    private final OrderRepository orders;
    private final CustomerService customers;
    private final ProductService products;

    public OrderService(OrderRepository orders, CustomerService customers, ProductService products) {
        this.orders = orders;
        this.customers = customers;
        this.products = products;
    }

    @Transactional(readOnly = true)
    public List<SalesOrder> findAll(Long customerId) {
        return customerId == null ? orders.findAllByOrderByOrderDateDesc()
                : orders.findByCustomerIdOrderByOrderDateDesc(customerId);
    }

    @Transactional(readOnly = true)
    public SalesOrder get(Long id) {
        return orders.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order " + id + " not found"));
    }

    /** Creates an order, prices it from current product prices and reduces stock. */
    @Transactional
    public SalesOrder place(OrderRequest req) {
        SalesOrder order = new SalesOrder();
        order.setCustomer(customers.get(req.customerId()));
        order.setOrderDate(LocalDateTime.now());
        BigDecimal total = BigDecimal.ZERO;

        for (OrderRequest.Line line : req.items()) {
            Product p = products.get(line.productId());
            if (p.getStock() < line.quantity()) {
                throw new IllegalArgumentException("Not enough stock for '" + p.getName()
                        + "' (available: " + p.getStock() + ")");
            }
            p.setStock(p.getStock() - line.quantity());

            OrderItem item = new OrderItem();
            item.setProduct(p);
            item.setQuantity(line.quantity());
            item.setUnitPrice(p.getPrice());
            order.addItem(item);
            total = total.add(p.getPrice().multiply(BigDecimal.valueOf(line.quantity())));
        }
        order.setTotal(total);
        return orders.save(order);
    }

    /** Changes status; cancelling an order returns its items to stock. */
    @Transactional
    public SalesOrder updateStatus(Long id, String status) {
        String s = status == null ? "" : status.toUpperCase();
        if (!STATUSES.contains(s)) throw new IllegalArgumentException("Status must be PLACED, DELIVERED or CANCELLED");
        SalesOrder o = get(id);
        if ("CANCELLED".equals(o.getStatus())) throw new IllegalArgumentException("Order is already cancelled");
        if ("CANCELLED".equals(s)) {
            for (OrderItem i : o.getItems()) {
                i.getProduct().setStock(i.getProduct().getStock() + i.getQuantity());
            }
        }
        o.setStatus(s);
        return orders.save(o);
    }
}
