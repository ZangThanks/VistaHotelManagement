package com.hotelvista.service;

import com.hotelvista.dto.BookingRequestDTO;
import com.hotelvista.dto.WalkInBookingDTO;
import com.hotelvista.model.*;
import com.hotelvista.model.enums.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class WalkInService {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private BookingService bookingService;


    @Autowired
    private RoomService roomService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private CartBeanService cartBeanService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BookingDetailService bookingDetailService;

    @Transactional
    public Booking createWalkInBooking(WalkInBookingDTO dto) {
        Customer customer = findOrCreateCustomer(dto);


        Room room = roomService.selectById(dto.getRoomNumber())
                .orElseThrow(() -> new RuntimeException("Room not found: " + dto.getRoomNumber()));

        if (room.getStatus() != RoomStatus.AVAILABLE) {
            throw new RuntimeException("Room is not available for booking");
        }

        List<Booking> conflicts = bookingService.findConflictingBookings(
                dto.getRoomNumber(),
                dto.getCheckInDate(),
                dto.getCheckOutDate()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Room has conflicting bookings in the selected dates");
        }

        Booking booking = createBooking(dto, customer, room);

        BookingDetail bookingDetail = createBookingDetail(booking, room);

//        room.setStatus(RoomStatus.BOOKED);
//        roomService.insertOrUpdate(room);

        bookingService.saveBooking(booking, List.of(bookingDetail), new ArrayList<>());

        return booking;
    }

    private Customer findOrCreateCustomer(WalkInBookingDTO dto) {
        Customer customer = null;

        if (dto.getPhone() != null && !dto.getPhone().isEmpty()) {
            customer = customerService.findByPhone(dto.getPhone());
        }

        if (customer == null && dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            customer = customerService.findByEmail(dto.getEmail());
        }

        if (customer == null) {
            customer = new Customer();
            customer.setId(customerService.generateCustomerId());
            customer.setFullName(dto.getFirstName() + " " + dto.getLastName());
            customer.setEmail(dto.getEmail());
            customer.setPhone(dto.getPhone());
            customer.setAddress(dto.getAddress());
            customer.setBirthDate(dto.getBirthDate());

            if (dto.getGender() != null) {
                customer.setGender(Gender.valueOf(dto.getGender().toUpperCase()));
            } else {
                customer.setGender(Gender.OTHER);
            }

            customer.setUserRole(UserRole.GUEST);
            customer.setJoinedDate(LocalDate.now());
            customer.setLoyaltyPoints(0);
            customer.setReputationPoint(50);
            customer.setMemberShipLevel(MemberShipLevel.BRONZE);
            customer.setUserName("WALKIN_" + System.currentTimeMillis());

            String tempPassword = dto.getPhone();
            customer.setPassword(passwordEncoder.encode(tempPassword));

            customerService.save(customer);
        }

        return customer;
    }

    private Booking createBooking(WalkInBookingDTO dto, Customer customer, Room room) {
        Booking booking = new Booking();
        booking.setBookingID(bookingService.generateBookingID());
        booking.setCustomer(customer);

        if (dto.getEmployeeId() != null) {
            Employee employee = employeeService.findById(dto.getEmployeeId());
            booking.setEmployee(employee);
        }

        booking.setBookingDate(LocalDateTime.now());
        booking.setCheckInDate(dto.getCheckInDate());
        booking.setCheckOutDate(dto.getCheckOutDate());
        booking.setNumberOfGuests(dto.getNumberOfGuests());
        booking.setSpecialRequests(dto.getSpecialRequests());
        booking.setPackageType(dto.getPackageType() != null ? dto.getPackageType() : "STANDARD");

        long days = ChronoUnit.DAYS.between(
                dto.getCheckInDate().toLocalDate(),
                dto.getCheckOutDate().toLocalDate()
        );
        booking.setDuration((int) days);
        booking.setType(com.hotelvista.model.enums.BookingType.DAILY);

        // Calculate total amount
        double roomPrice = room.getRoomType().getBasePrice();
        double totalAmount = roomPrice * days;
        booking.setTotalAmount(totalAmount);
        booking.setTotalCost(totalAmount);

        // Set status
        booking.setStatus(BookingStatus.CHECKED_IN);
        booking.setPaymentStatus(PaymentStatus.PENDING);

        return booking;
    }

    private BookingDetail createBookingDetail(Booking booking, Room room) {
        BookingDetail detail = new BookingDetail();
        detail.setBooking(booking);
        detail.setRoom(room);
        detail.setRoomPrice(room.getRoomType().getBasePrice());

        return detail;
    }

    /**
     * Get available rooms for walk-in
     */
    public List<Room> getAvailableRoomsForWalkIn(
            String roomTypeId,
            LocalDateTime checkIn,
            LocalDateTime checkOut
    ) {
        List<Room> allRooms = roomService.selectAll();
        List<Room> availableRooms = new ArrayList<>();

        for (Room room : allRooms) {
            if (roomTypeId != null && !room.getRoomType().getRoomTypeID().equals(roomTypeId)) {
                continue;
            }

            if (room.getStatus() != RoomStatus.AVAILABLE) {
                continue;
            }

            List<Booking> conflicts = bookingService.findConflictingBookings(
                    room.getRoomNumber(),
                    checkIn,
                    checkOut
            );

            if (conflicts.isEmpty()) {
                availableRooms.add(room);
            }
        }

        return availableRooms;
    }
}
