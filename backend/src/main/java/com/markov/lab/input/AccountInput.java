package com.markov.lab.input;

import lombok.Data;

@Data
public class AccountInput {
    private long userId;
    private long roleId;
    private Boolean isActive;
}
