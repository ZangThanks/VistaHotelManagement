package com.hotelvista.service;

import com.hotelvista.dto.MaintenanceRequestDTO;
import com.hotelvista.model.Booking;
import com.hotelvista.model.MaintenanceRequest;
import com.hotelvista.model.enums.RequestStatus;
import com.hotelvista.repository.BookingRepository;
import com.hotelvista.repository.MaintenanceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceRequestService {
    private final MaintenanceRequestRepository requestRepo;
    private final BookingRepository bookingRepo;

    @Autowired
    public MaintenanceRequestService(MaintenanceRequestRepository repo, BookingRepository bookingRepo) {
        this.requestRepo = repo;
        this.bookingRepo = bookingRepo;
    }

    /**
     * Lấy danh sách tất cả các yêu cầu bảo trì.
     *
     * @return danh sách {@link MaintenanceRequest} hiện có
     */
    public List<MaintenanceRequest> selectAll() {
        return requestRepo.findAll();
    }

    /**
     * Lấy thông tin yêu cầu bảo trì theo id.
     *
     * @param id mã yêu cầu bảo trì
     * @return đối tượng {@link Optional} chứa thông tin {@link MaintenanceRequest} nếu tìm thấy,
     *         ngược lại trả về {@code Optional.empty()}
     */
    public Optional<MaintenanceRequest> selectById(String id) {
        return requestRepo.findById(id);
    }

    /**
     * Thêm mới hoặc cập nhật thông tin yêu cầu bảo trì.
     * Nếu yêu cầu đã tồn tại (theo ID) thì sẽ được cập nhật.
     *
     * @param request đối tượng {@link MaintenanceRequest} cần lưu
     * @return yêu cầu bảo trì sau khi lưu thành công
     */
    public MaintenanceRequest insertOrUpdate(MaintenanceRequest request) {
        return requestRepo.save(request);
    }

    /**
     * Thêm mới yêu cầu bảo trì từ DTO (dành cho frontend).
     * Convert bookingId string thành Booking object.
     *
     * @param dto đối tượng {@link MaintenanceRequestDTO} từ frontend
     * @return yêu cầu bảo trì sau khi lưu thành công
     */
    public MaintenanceRequest insertFromDTO(MaintenanceRequestDTO dto) {
        MaintenanceRequest request = new MaintenanceRequest();
        request.setRequestID(dto.getRequestID());
        request.setDescription(dto.getDescription());
        request.setPrioty(dto.getPrioty());
        request.setStatus(dto.getStatus());
        request.setAssignedTo(dto.getAssignedTo());
        request.setEstimatedTime(dto.getEstimatedTime());
        request.setActualCost(dto.getActualCost());
        request.setImageUrl(dto.getImageUrl());
        request.setRequestDate(LocalDateTime.now());
        
        // Convert bookingId string to Booking object
        if (dto.getBookingId() != null && !dto.getBookingId().isEmpty()) {
            Optional<Booking> booking = bookingRepo.findById(dto.getBookingId());
            booking.ifPresent(request::setBooking);
        }
        
        return requestRepo.save(request);
    }

    /**
     * Xóa yêu cầu bảo trì khỏi cơ sở dữ liệu theo mã ID.
     *
     * @param id mã định danh của yêu cầu cần xóa
     */
    public void delete(String id) {
        requestRepo.deleteById(id);
    }

    /**
     * Cập nhật trạng thái của yêu cầu bảo trì theo mã ID.
     *
     * @param id     mã yêu cầu bảo trì
     * @param status trạng thái mới cần cập nhật
     * @return yêu cầu bảo trì sau khi đã cập nhật trạng thái, hoặc null nếu không tìm thấy
     */
    public MaintenanceRequest updateStatus(String id, RequestStatus status) {
        Optional<MaintenanceRequest> optionalRequest = requestRepo.findById(id);
        if (optionalRequest.isPresent()) {
            MaintenanceRequest request = optionalRequest.get();
            request.setStatus(status);
            return requestRepo.save(request);
        }
        return null;
    }
}
