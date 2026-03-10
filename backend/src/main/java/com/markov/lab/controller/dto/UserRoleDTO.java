package com.markov.lab.controller.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserRoleDTO {
    private String username;
    private String role;
    private String name;
    @JsonProperty("account_id") // Maps JSON field to this Java field
    private int accountId;

    // Getters and setters
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getAccountId() {
        return accountId;
    }

    public void setAccountId(int accountId) {
        this.accountId = accountId;
    }

    @Override
    public String toString() {
        return "UserRoleDTO{" +
                "username='" + username + '\'' +
                "role='" + role + '\'' +
                ", accountId=" + accountId +
                '}';
    }

}
