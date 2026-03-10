package com.markov.lab.input;

public record UpdateIntrantInput(
         long id,
         double conversionFactor,
         double roundFactor,
         double otherFactor,
         String sku,
         String primary_sku
) {
}
