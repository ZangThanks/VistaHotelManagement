package com.hotelvista.service;

import com.hotelvista.model.RoomType;
import com.hotelvista.repository.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomTypeService {
    private final RoomTypeRepository roomTypeRepo;

    @Autowired
    public RoomTypeService(RoomTypeRepository repo) {
        this.roomTypeRepo = repo;
    }
    /**
     * Lấy danh sách tất cả các loại phòng.
     *
     * @return danh sách {@link RoomType} hiện có
     */
    public List<RoomType> selectAll() {
        return roomTypeRepo.findAll();
    }

    /**
     * Tìm kiếm loại phòng theo ID.
     *
     * @param id mã loại phòng
     * @return đối tượng {@link Optional} chứa thông tin {@link RoomType} nếu tìm thấy,
     *         ngược lại trả về {@code Optional.empty()}
     */
    public Optional<RoomType> selectById(String id) {
        return roomTypeRepo.findById(id);
    }

    /**
     * Thêm mới hoặc cập nhật thông tin loại phòng.
     * Nếu loại phòng đã tồn tại (theo ID) thì sẽ được cập nhật.
     *
     * @param roomType đối tượng {@link RoomType}
     * @return loại phòng sau khi đã được lưu thành công
     */
    public RoomType insertOrUpdate(RoomType roomType) {
        return roomTypeRepo.save(roomType);
    }

    /**
     * Xóa loại phòng khỏi cơ sở dữ liệu theo mã ID.
     *
     * @param id mã định danh của loại phòng cần xóa
     */
    public void delete(String id) {
        roomTypeRepo.deleteById(id);
    }

}
