package com.markov.lab.input;

public record SanguineProductTransactionInput(
        long sanguine_product_id,
        int quantity
) {
}
