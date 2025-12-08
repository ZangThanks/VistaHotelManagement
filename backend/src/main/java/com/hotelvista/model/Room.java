package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.hotelvista.model.enums.RoomStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "rooms")
public class Room {
    @Id
    @Column(name = "room_number", insertable=false, updatable=false)
    private String roomNumber;

    private Integer floor;

    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    @Column(name = "last_cleaned")
    private LocalDateTime lastCleaned;

    private String notes;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_type_id")
    private RoomType roomType;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "room")
    private List<BookingDetail> bookingDetails;

    @ElementCollection
    @CollectionTable(name = "room_images", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "images_url")
    private List<String> images;

    @ToString.Exclude
    @JsonIgnore
    @ManyToMany(mappedBy = "items")
    private List<CartBean> cartBeans;
}
