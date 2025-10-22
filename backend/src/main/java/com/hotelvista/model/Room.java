package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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

    private int floor;

    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    @Column(name = "last_cleaned")
    private LocalDateTime lastCleaned;

    private String notes;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "room_type_id")
    private RoomType roomType;

    @ToString.Exclude
    @OneToMany(mappedBy = "room")
    @JsonManagedReference
    @JsonIgnore
    private List<BookingDetail> bookingDetails;
}
