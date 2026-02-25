package com.markov.lab.input;

import java.util.List;

public record TransactionInput(
        long origin_id,
        long destination_id,
        long equipment_id,
        List<SanguineProductTransactionInput> sanguine_product_transaction_input_list,
        List<MedicinesTransactionInput> medicines_transaction_input_list
) {
}
