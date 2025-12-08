package com.hotelvista.service;

import com.hotelvista.dto.ServiceReportDTO;
import com.hotelvista.model.BookingService;
import com.hotelvista.model.enums.ServiceCategory;
import com.hotelvista.repository.BookingServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final BookingServiceRepository bookingServiceRepository;

    /**
     * Lấy báo cáo dịch vụ theo khoảng thời gian
     * @param startDate ngày bắt đầu
     * @param endDate ngày kết thúc
     * @param period loại báo cáo: daily, weekly, monthly, quarterly, yearly
     * @return danh sách ServiceReportDTO
     */
    public List<ServiceReportDTO> getServiceReport(LocalDate startDate, LocalDate endDate, String period) {
        List<BookingService> bookingServices = bookingServiceRepository.findByDateRange(startDate, endDate);
        
        // Group by period
        Map<String, List<BookingService>> groupedData = groupByPeriod(bookingServices, period);
        
        // Calculate statistics for each period
        List<ServiceReportDTO> reports = new ArrayList<>();
        for (Map.Entry<String, List<BookingService>> entry : groupedData.entrySet()) {
            reports.add(calculateReport(entry.getKey(), entry.getValue()));
        }
        
        // Sort by date
        reports.sort(Comparator.comparing(ServiceReportDTO::getDate));
        
        return reports;
    }

    /**
     * Group booking services by period
     */
    private Map<String, List<BookingService>> groupByPeriod(List<BookingService> bookingServices, String period) {
        DateTimeFormatter formatter;
        
        switch (period.toLowerCase()) {
            case "daily":
                formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                break;
            case "weekly":
                formatter = DateTimeFormatter.ofPattern("'Week' ww yyyy");
                break;
            case "monthly":
                formatter = DateTimeFormatter.ofPattern("MMM yyyy");
                break;
            case "quarterly":
                return groupByQuarter(bookingServices);
            case "yearly":
                formatter = DateTimeFormatter.ofPattern("yyyy");
                break;
            default:
                formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        }
        
        DateTimeFormatter finalFormatter = formatter;
        return bookingServices.stream()
                .collect(Collectors.groupingBy(bs -> 
                    bs.getBooking().getCheckInDate().toLocalDate().format(finalFormatter)
                ));
    }

    /**
     * Group by quarter
     */
    private Map<String, List<BookingService>> groupByQuarter(List<BookingService> bookingServices) {
        return bookingServices.stream()
                .collect(Collectors.groupingBy(bs -> {
                    LocalDate date = bs.getBooking().getCheckInDate().toLocalDate();
                    int quarter = (date.getMonthValue() - 1) / 3 + 1;
                    return "Q" + quarter + " " + date.getYear();
                }));
    }

    /**
     * Calculate report statistics for a period
     */
    private ServiceReportDTO calculateReport(String date, List<BookingService> bookingServices) {
        ServiceReportDTO report = new ServiceReportDTO();
        report.setDate(date);
        
        double foodBeverageTotal = 0;
        double laundryTotal = 0;
        double spaTotal = 0;
        double transportTotal = 0;
        double tourTotal = 0;
        double othersTotal = 0;
        int totalOrders = bookingServices.size();
        
        for (BookingService bs : bookingServices) {
            ServiceCategory category = bs.getService().getServiceCategory();
            double amount = bs.getTotalAmount() != null ? bs.getTotalAmount() : 0;
            
            switch (category) {
                case FOOD_BEVERAGE:
                    foodBeverageTotal += amount;
                    break;
                case LAUNDRY:
                    laundryTotal += amount;
                    break;
                case SPA:
                    spaTotal += amount;
                    break;
                case TRANSPORT:
                    transportTotal += amount;
                    break;
                case TOUR:
                    tourTotal += amount;
                    break;
                default:
                    // WELLNESS, RECREATION, OTHER đều vào Others
                    othersTotal += amount;
                    break;
            }
        }
        
        report.setFoodBeverage(foodBeverageTotal);
        report.setLaundry(laundryTotal);
        report.setSpa(spaTotal);
        report.setTransport(transportTotal);
        report.setTour(tourTotal);
        report.setOthers(othersTotal);
        report.setTotalOrders(totalOrders);
        
        double totalRevenue = foodBeverageTotal + laundryTotal + spaTotal + transportTotal + tourTotal + othersTotal;
        double avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        report.setAvgOrderValue(avgOrderValue);
        
        return report;
    }
}
