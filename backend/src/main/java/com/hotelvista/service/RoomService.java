package com.hotelvista.service;

import com.hotelvista.model.Room;
import com.hotelvista.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {
    private final RoomRepository roomRepo;

    @Autowired
    public RoomService(RoomRepository repo) {
        this.roomRepo = repo;
    }

    public Room findById(String id) {
        return roomRepo.findById(id).orElse(null);
    }

    /**
     * get danh sách tất cả các phòng
     *
     * @return danh sách {@link Room} hiện có
     */
    public List<Room> selectAll() {
        return roomRepo.findAll();
    }

    /**
     * get phòng theo id
     *
     * @param id mã phòng
     * @return đối tượng {@link Optional} chứa thông tin {@link Room} nếu tìm thấy,
     *         ngược lại trả về {@code Optional.empty()}
     */
    public Optional<Room> selectById(String id) {
        return roomRepo.findById(id);
    }
    /**
     * Thêm mới hoặc cập nhật thông tin một phòng trong cơ sở dữ liệu.
     * Nếu phòng đã tồn tại (theo ID) thì sẽ được cập nhật thông tin.
     *
     * @param room đối tượng {@link Room}
     * @return phòng sau khi đã được lưu thành công
     */
    public Room insertOrUpdate(Room room) {
        return roomRepo.save(room);
    }
    /**
     * Xóa phòng bằng id
     *
     * @param id mã định danh của phòng cần xóa
     */
    public void delete(String id) {
        roomRepo.deleteById(id);
    }

    public void save(Room room) {

    }

    public List<Room> findAvailableRooms(LocalDateTime startDate, LocalDateTime endDate) {
        return roomRepo.findAvailableRooms(startDate, endDate);
    }
}
