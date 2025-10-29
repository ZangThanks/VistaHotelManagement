package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@AttributeOverride(name = "id", column = @Column(name = "admin_id"))
@Table(name = "admins")
public class Admin extends User{

    @Column(name = "admin_level")
    private Integer adminLevel;

    @ElementCollection
    @CollectionTable(name = "admin_permissions", joinColumns = @JoinColumn(name = "user_id"))
    private List<String> permissions;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "admin")
    private List<Promotion> promotions;
}
