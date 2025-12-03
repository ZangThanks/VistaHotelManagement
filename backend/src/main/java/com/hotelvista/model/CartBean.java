package com.hotelvista.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@Table(name = "cart_beans")
public class CartBean {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "cart_bean_id")
    private String cartBeanId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "cart_items",
            joinColumns = @JoinColumn(name = "cart_bean_id"),
            inverseJoinColumns = @JoinColumn(name = "room_number")
    )
    private List<Room> items;

    public CartBean() {
        this.items = new ArrayList<>();
    }
}
