package com.hotelvista.repository;

import com.hotelvista.model.Service;
import com.hotelvista.model.enums.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, String> {
    /**
     * Tìm các service theo trạng thái availability
     *
     * @param availability
     * @return
     */
    List<Service> findAllByAvailability(boolean availability);

    /**
     * Tìm các service theo tên (không phân biệt hoa thường)
     *
     * @param serviceName
     * @return
     */
    List<Service> findAllByServiceNameContainingIgnoreCase(String serviceName);

    /**
     * Tìm các service theo danh mục dịch vụ
     *
     * @param serviceCategory
     * @return
     */
    List<Service> findAllByServiceCategory(ServiceCategory serviceCategory);

    /**
     * Tìm Service theo bookingID
     * @param bookingId
     * @return List<Service>
     */
    @Query("""
    SELECT bs.service
    FROM BookingService bs
    WHERE bs.booking.bookingID = :bookingId
""")
    List<Service> findServicesByBookingId(String bookingId);

}