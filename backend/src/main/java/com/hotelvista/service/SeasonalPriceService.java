package com.hotelvista.service;

import com.hotelvista.dto.PriceDTO;
import com.hotelvista.model.RoomType;
import com.hotelvista.model.SeasonalPrice;
import com.hotelvista.repository.BookingRepository;
import com.hotelvista.repository.RoomTypeRepository;
import com.hotelvista.repository.RoomTypeSeasonalPriceRepository;
import com.hotelvista.repository.SeasonalPriceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeasonalPriceService {
    private final SeasonalPriceRepository repo;
    private final BookingRepository bookingRepo;
    private final RoomTypeSeasonalPriceRepository linkRepo;

    public SeasonalPriceService(SeasonalPriceRepository repo, BookingRepository bookingRepo, RoomTypeSeasonalPriceRepository linkRepo) {
        this.repo = repo;
        this.bookingRepo = bookingRepo;
        this.linkRepo = linkRepo;
    }

    /**
     * Lấy danh sách tất cả các mức giá theo mùa.
     *
     * @return danh sách {@link SeasonalPrice} hiện có
     */
    public List<SeasonalPrice> getAllSeasonalPrices() {
        return repo.findAll();
    }

    /**
     * Tìm kiếm mức giá theo mùa theo ID.
     *
     * @param id mã mức giá theo mùa
     * @return đối tượng {@link SeasonalPrice} nếu tìm thấy, ngược lại trả về {@code null}
     */
    public SeasonalPrice getSeasonalPriceById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    /**
     * Thêm mới hoặc cập nhật thông tin mức giá theo mùa.
     * Nếu mức giá đã tồn tại (theo ID) thì sẽ được cập nhật.
     *
     * @param price đối tượng {@link SeasonalPrice}
     */
    public void saveSeasonalPrice(SeasonalPrice price) {
        repo.save(price);
    }

    /**
     * Xóa mức giá theo mùa khỏi cơ sở dữ liệu theo mã ID.
     *
     * @param id mã định danh của mức giá cần xóa
     */
    public void deleteSeasonalPrice(int id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Not found Seasonal Price with id: " + id);
        }
        boolean isInUse = bookingRepo.existsBookingsBySeasonalPrice(id);
        if (isInUse) {
            throw new RuntimeException("Cannot delete Seasonal Price with id: " + id + " because it is in use by existing bookings.");
        }
        repo.deleteById(id);
    }

    public List<PriceDTO> getAllSeasonalPrices_RoomType() {
        List<SeasonalPrice> entities = repo.findAllWithRoomTypes();
        return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public PriceDTO getSeasonalPrice_RoomTypeById(int id) {
        SeasonalPrice sp = repo.findByIdWithRoomTypes(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giá ID: " + id));

        return convertToDTO(sp);
    }

    /**
     * Chuyển đổi đối tượng {@link SeasonalPrice} sang {@link PriceDTO}.
     *
     * @param sp đối tượng {@link SeasonalPrice}
     * @return đối tượng {@link PriceDTO} tương ứng
     */
    private PriceDTO convertToDTO(SeasonalPrice sp) {
        List<String> roomTypeIds = sp.getRoomTypes().stream()
                .map(RoomType::getRoomTypeID)
                .collect(Collectors.toList());

        return new PriceDTO(sp, roomTypeIds);
    }

    /**
     * Tạo mới hoặc cập nhật mức giá theo mùa cùng với các loại phòng liên kết.
     *
     * @param dto đối tượng {@link PriceDTO} chứa thông tin mức giá và danh sách mã loại phòng
     * @return đối tượng {@link SeasonalPrice} đã được lưu thành công
     */
    @Transactional
    public SeasonalPrice createOrUpdateSeasonPrice(PriceDTO dto) {
        SeasonalPrice price = dto.getSeasonalPrice();

        SeasonalPrice savedPrice = repo.saveAndFlush(price);

        linkRepo.deleteBySeasonalPriceId(savedPrice.getId());

        if (dto.getRoomTypeIDs() != null) {
            for (String roomTypeId : dto.getRoomTypeIDs()) {
                linkRepo.insertSeasonalPriceRoomType(roomTypeId, savedPrice.getId());
            }
        }

        return savedPrice;
    }



}
