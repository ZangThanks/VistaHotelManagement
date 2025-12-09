package com.hotelvista.service;

import com.hotelvista.exception.BadRequestException;
import com.hotelvista.model.*;
import com.hotelvista.model.enums.*;
import com.hotelvista.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class BookingService {
    @Autowired
    private BookingRepository repo;

    @Autowired
    private BookingServiceRepository serviceRepo;

    @Autowired
    private BookingDetailRepository detailRepo;

    @Autowired
    private RoomRepository roomRepo;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private BookingCancellationRepository cancellationRepo;

    @Autowired
    private CustomerRepository customerRepo;

    @Transactional(readOnly = true)
    public List<Booking> findAll() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Booking findById(String id) {
        return repo.findById(id).orElse(null);
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean save(Booking booking) {
        try {
            repo.save(booking);
            return true;
        } catch (Exception e) {
            System.err.println("ERROR saving booking: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean saveBooking(Booking booking, List<BookingDetail> bookingDetails, List<com.hotelvista.model.BookingService> bookingServices) {
        try {
            Booking savedBooking = repo.save(booking);

            if(bookingDetails != null && !bookingDetails.isEmpty()) {
                for (BookingDetail detail : bookingDetails) {
                    Room room = roomRepo.findById(detail.getRoom().getRoomNumber())
                        .orElseThrow(() -> new BadRequestException("Room not found: " + detail.getRoom().getRoomNumber()));
                    
                    detail.setRoom(room);
                    detail.setBooking(savedBooking);
                    detailRepo.save(detail);
                }
            }

            if(bookingServices != null && !bookingServices.isEmpty()) {
                for (com.hotelvista.model.BookingService service : bookingServices) {
                    com.hotelvista.model.Service svc = serviceRepository.findById(service.getService().getServiceID())
                        .orElseThrow(() -> new BadRequestException("Service not found: " + service.getService().getServiceID()));
                    
                    service.setService(svc);
                    service.setBooking(savedBooking);
                    serviceRepo.save(service);
                }
            }

            return true;
        } catch (Exception e) {
            System.err.println("ERROR saving booking: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public boolean deleteById(String id) {
        try {
            repo.deleteById(id);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Transactional(readOnly = true)
    public List<Booking> findAllByBookingDateBetween(LocalDateTime bookingDateAfter, LocalDateTime bookingDateBefore) {
        return repo.findAllByBookingDateBetween(bookingDateAfter, bookingDateBefore);
    }

    @Transactional(readOnly = true)
    public List<Booking> findAllByCustomer_Id(String customerId) {
        return repo.findAllByCustomer_Id(customerId);
    }

    @Transactional(readOnly = true)
    public List<Booking> searchBookings(String keyword) {
        return repo.searchBookings(keyword);
    }

    @Transactional
    public String generateBookingID() {
         LocalDate today = LocalDate.now();
         String prefix = "B" + today.format(DateTimeFormatter.ofPattern("ddMMyy")); // B110925
    
        Integer maxSequence = repo.findMaxSequenceForToday(prefix);
        int nextSequence = (maxSequence == null) ? 1 : maxSequence + 1;
    
        return prefix + String.format("%04d", nextSequence); // B1109250001
    }

    @Transactional(readOnly = true)
    public List<Booking> findAllByRoom_RoomNumber(String roomNumber) {
        return repo.findAllByRoom_RoomNumber(roomNumber);
    }

    /**
     * Check-in a booking
     */
    @Transactional
    public Booking checkIn(String bookingId) {

        Booking booking = repo.findById(bookingId)
                .orElseThrow(() -> new BadRequestException("Booking not found: " + bookingId));

        // Validate
        if (booking.getStatus() == BookingStatus.CHECKED_IN) {
            throw new BadRequestException("Booking is already checked in");
        }

        if (booking.getStatus() == BookingStatus.CHECKED_OUT) {
            throw new BadRequestException("Cannot check in a checked out booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot check in a cancelled booking");
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime checkInDate = booking.getCheckInDate();

        boolean canCheckIn = false;

        if (now.toLocalDate().isEqual(checkInDate.toLocalDate()) || now.isAfter(checkInDate)) {
            canCheckIn = true;
        }

        if (booking.getEarlyCheckin() != null &&
                booking.getEarlyCheckin().getApprovalStatus() == ApprovalStatus.APPROVED) {

            LocalDateTime earlyCheckInTime = booking.getEarlyCheckin().getRequestDate();

            if (now.isAfter(earlyCheckInTime) || now.isEqual(earlyCheckInTime)) {
                canCheckIn = true;
            }
        }

        if (!canCheckIn) {
            throw new BadRequestException("Check-in time has not arrived yet");
        }

        // Update
        booking.setStatus(BookingStatus.CHECKED_IN);
        booking.setActualCheckInTime(now);

        return repo.save(booking);
    }

    public List<Booking> findAllByCheckInDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return repo.findAllByCheckInDateBetween(startDate, endDate);
    }

    public List<Booking> findAllByCheckOutDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return repo.findAllByCheckOutDateBetween(startDate, endDate);
    }
    
    public List<Booking> findConflictingBookings(String roomNumber, LocalDateTime checkIn, LocalDateTime checkOut) {
        return repo.findConflictingBookings(roomNumber, checkIn, checkOut);
    }

    @Transactional(rollbackFor = Exception.class)
    public BookingCancellation cancelBooking(String bookingId, Map<String, Object> body) {

        Booking booking = repo.findById(bookingId)
                .orElseThrow(() -> new BadRequestException("Booking not found: " + bookingId));

        // Validate trạng thái booking
        if (booking.getStatus() == BookingStatus.CHECKED_IN)
            throw new BadRequestException("Không thể hủy sau khi đã check-in");

        if (booking.getStatus() == BookingStatus.CHECKED_OUT)
            throw new BadRequestException("Không thể hủy sau khi đã check-out");

        if (booking.getStatus() == BookingStatus.CANCELLED)
            throw new BadRequestException("Booking đã bị hủy trước đó");

        // Lấy dữ liệu từ JSON
        String cancelReason = (String) body.get("cancelReason");
        String cancelledBy = (String) body.get("cancelledBy");

        if (cancelReason == null || cancelReason.isBlank())
            throw new BadRequestException("Vui lòng nhập lý do hủy");

        // Tính số ngày giữa hôm nay và ngày check-in
        long daysUntilCheckin =
                ChronoUnit.DAYS.between(LocalDate.now(), booking.getCheckInDate().toLocalDate());

        double refundAmount = 0;

        // Xử lý logic hoàn tiền
        Set<PaymentStatus> paidStatuses = Set.of(
                PaymentStatus.COMPLETED,
                PaymentStatus.PERCENTAGE_30,
                PaymentStatus.PERCENTAGE_50,
                PaymentStatus.PAID
        );

        if (paidStatuses.contains(booking.getPaymentStatus()) &&
                booking.getStatus() == BookingStatus.PENDING) {

            if (daysUntilCheckin >= 7)
                refundAmount = booking.getTotalAmount();
            else if (daysUntilCheckin >= 3)
                refundAmount = booking.getTotalAmount() * 0.5;
            else
                refundAmount = 0;
        }

        // Cập nhật booking
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationDate(LocalDateTime.now());
        repo.save(booking);

        // cập nhật Room -> AVAILABLE
        for (BookingDetail detail : booking.getBookingDetails()) {
            Room room = detail.getRoom();
            room.setStatus(RoomStatus.AVAILABLE);
            roomRepo.save(room);
        }

        // Tạo bản ghi BookingCancellation
        BookingCancellation cancel = new BookingCancellation();
        cancel.setId(generateCancellationId(bookingId));
        cancel.setBooking(booking);
        cancel.setCancelReason(cancelReason);
        cancel.setCancelledAt(LocalDateTime.now());
        cancel.setRefundAmount(refundAmount);

        // Nếu có refund
        if (refundAmount > 0 && body.containsKey("refundMethod")) {

            Map<String, Object> rm = (Map<String, Object>) body.get("refundMethod");

            String methodStr = (String) rm.get("method");
            RefundMethod method = RefundMethod.valueOf(methodStr);
            cancel.setRefundMethod(method);

            String refundInfo = "";

            switch (method) {
                case BANK_TRANSFER -> {
                    refundInfo =
                            rm.get("bankName") + " | " +
                                    rm.get("accountNumber") + " | " +
                                    rm.get("accountName");
                }
                case MOMO, ZALOPAY, VNPAY -> {
                    refundInfo = (String) rm.get("mobileNumber");
                }
            }

            cancel.setRefundAccountInfo(refundInfo);
        }

        return cancellationRepo.save(cancel);
    }

    public String generateCancellationId(String bookingId) {
        return "C-" + bookingId;
    }

}

