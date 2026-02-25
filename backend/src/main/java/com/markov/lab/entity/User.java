package com.markov.lab.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;

    @NotBlank(message = "Email cannot be blank")
    private String username;
    @NotBlank(message = "Password cannot be blank")
    private String password;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Account account;

    public void setAccount(Account account)
    {
        this.account = account;
        this.account.setUser(this);
    }

    public void removePassword()
    {
        this.password = null;
    }
}
