package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;
import java.util.Objects;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "room_types")
public class RoomType {
    @Id
    @Column(name = "room_type_id")
    private String roomTypeID;

    @Column(name = "type_name")
    private String typeName;

    private String description;

    private Double area;

    //Số lượng người lưu trú tối đa
    @Column(name = "max_occupancy")
    private Integer maxOccupancy;

    //Tiện nghi (máy lạnh, nước nóng, ...)
    @ElementCollection
    @CollectionTable(name = "room_type_amenties", joinColumns = @JoinColumn(name = "room_type_id"))
    @Column(columnDefinition = "NVARCHAR(255)")
    private List<String> amenties;

    @Column(name = "base_price")
    private Double basePrice;


    @ElementCollection
    @CollectionTable(name = "room_type_images", joinColumns = @JoinColumn(name = "room_type_id"))
    @Column(name = "images_url")
    private List<String> images;

    @ToString.Exclude
    @OneToMany(mappedBy = "roomType")
    @JsonIgnore
    private List<Room> rooms;

    @ToString.Exclude
    @OneToMany(mappedBy = "roomType")
    @JsonIgnore
    private List<RoomTypePromotion> roomTypePromotions;
}
