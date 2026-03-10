package com.markov.lab.output;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.markov.lab.entity.User;


public class UserDetailsOutput {
    @JsonProperty("username")
    String username;
    @JsonProperty("name")
    String name;
    @JsonProperty("role")
    String role;
    @JsonProperty("account_id")
    Long accountId;



    public UserDetailsOutput(User user) {
        this.role = user.getAccount().getRole().getRole();
        this.accountId = user.getAccount().getId();
        this.username = user.getUsername();
        this.name = user.getName();
    }
}
