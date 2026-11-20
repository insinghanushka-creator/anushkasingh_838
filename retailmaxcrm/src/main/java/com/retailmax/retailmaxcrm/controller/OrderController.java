package com.retailmax.retailmaxcrm.controller;

import com.retailmax.retailmaxcrm.dto.OrderRequest;
import com.retailmax.retailmaxcrm.entity.SalesOrder;
import com.retailmax.retailmaxcrm.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @GetMapping
    public List<SalesOrder> all(@RequestParam(required = false) Long customerId) {
        return service.findAll(customerId);
    }

    @GetMapping("/{id}")
    public SalesOrder one(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SalesOrder place(@Valid @RequestBody OrderRequest req) {
        return service.place(req);
    }

    @PutMapping("/{id}/status")
    public SalesOrder status(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return service.updateStatus(id, body.get("status"));
    }
}
