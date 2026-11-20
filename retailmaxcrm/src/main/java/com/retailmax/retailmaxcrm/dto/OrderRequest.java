package com.retailmax.retailmaxcrm.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record OrderRequest(
        @NotNull(message = "Customer is required") Long customerId,
        @NotEmpty(message = "Add at least one item") @Valid List<Line> items) {

    public record Line(
            @NotNull(message = "Product is required") Long productId,
            @Min(value = 1, message = "Quantity must be at least 1") int quantity) {
    }
}
