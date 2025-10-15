package com.hotelvista.model;

import com.hotelvista.model.enums.Gender;
import com.hotelvista.model.enums.MemberShipLevel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
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

    @Column(name = "loyalty_points")
    private int loyaltyPoints;

    @Column(name = "membership_level")
    @Enumerated(EnumType.STRING)
    private MemberShipLevel memberShipLevel;

    @ToString.Exclude
    @OneToMany(mappedBy = "customer")
    private List<CustomerVoucher> customerVouchers;

    @ToString.Exclude
    @OneToMany(mappedBy = "customer")
    private List<Booking> bookings;

    @ToString.Exclude
    @OneToMany(mappedBy = "customer")
    private List<EarlyCheckin> earlyCheckin;
}
