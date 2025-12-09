package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hotelvista.model.enums.Gender;
import com.hotelvista.model.enums.MemberShipLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(callSuper = true)
@AttributeOverride(name = "id", column = @Column(name = "customer_id"))
@Table(name = "customers")
public class Customer extends User{

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "joined_date")
    private LocalDate joinedDate;

    @Column(name = "loyalty_points")
    private Integer loyaltyPoints;

    //Điểm uy tín, mặc định khi thêm mới là 100đ
    @Column(name = "reputation_point")
    private Integer reputationPoint;

    @Column(name = "membership_level")
    @Enumerated(EnumType.STRING)
    private MemberShipLevel memberShipLevel;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "customer")
    private List<CustomerVoucher> customerVouchers;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "customer")
    private List<Booking> bookings;

    @ToString.Exclude
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "cart_bean_id")
    private CartBean cartBean;
}