package com.hotelvista.service;

import com.hotelvista.model.CartBean;
import com.hotelvista.model.Customer;
import com.hotelvista.model.Room;
import com.hotelvista.repository.CartBeanRepository;
import com.hotelvista.repository.CustomerRepository;
import com.hotelvista.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartBeanService {
    @Autowired
    private CartBeanRepository repo;

    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private RoomRepository roomRepo;

    @Transactional
    public boolean save(CartBean cartBean) {
        try {
            repo.save(cartBean);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Transactional
    public boolean addRoomToCart(String customerId, String roomNumber) {
        try {
            Customer customer = customerRepo.findById(customerId).orElse(null);
            if (customer == null) {
                System.out.println("Customer not found: " + customerId);
                return false;
            }

            Room room = roomRepo.findById(roomNumber).orElse(null);
            if (room == null) {
                System.out.println("Room not found: " + roomNumber);
                return false;
            }

            CartBean cartBean = repo.getByCustomer_Id(customerId);
            if (cartBean == null) {
                // Create new cart for customer
                cartBean = new CartBean();
                cartBean.setCustomer(customer);
            }

            // Check if room already in cart
            if (cartBean.getItems().stream().anyMatch(r -> r.getRoomNumber().equals(roomNumber))) {
                System.out.println("Room already in cart: " + roomNumber);
                return true;
            }

            if (!room.getCartBeans().contains(cartBean)) {
                room.getCartBeans().add(cartBean);
            }

            cartBean.getItems().add(room);
            repo.save(cartBean);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Transactional
    public boolean removeRoomFromCart(String customerId, String roomNumber) {
        try {
            CartBean cartBean = repo.getByCustomer_Id(customerId);
            if (cartBean == null) {
                System.out.println("Cart not found for customer: " + customerId);
                return false;
            }

            boolean removed = cartBean.getItems().removeIf(r -> r.getRoomNumber().equals(roomNumber));
            if (removed) {
                repo.save(cartBean);
                return true;
            } else {
                System.out.println("Room not found in cart: " + roomNumber);
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Transactional(readOnly = true)
    public CartBean getByCustomer_Id(String customerId) {
        return repo.getByCustomer_Id(customerId);
    }
}
