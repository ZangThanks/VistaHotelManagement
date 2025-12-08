package com.hotelvista.service;

import com.hotelvista.dto.RevenueReportDTO;
import com.hotelvista.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
public class RevenueReportService {

    @Autowired
    private ReportRepository reportRepository;

    public List<RevenueReportDTO> getMonthlyRevenue() {

        return reportRepository.getAll().stream().map(item -> {

            String date = Month.of(item.getMonth())
                    .getDisplayName(TextStyle.SHORT, Locale.ENGLISH)
                    + " " + item.getYear();

            return new RevenueReportDTO(
                    date,
                    item.getRoomRevenue(),
                    item.getServiceRevenue(),
                    item.getTotalRevenue(),
                    item.getBookingCount()
            );
        }).toList();
    }


}
