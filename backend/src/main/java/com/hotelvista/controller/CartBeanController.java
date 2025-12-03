    package com.hotelvista.controller;

    import com.hotelvista.model.CartBean;
    import com.hotelvista.service.CartBeanService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    @RestController
    @RequestMapping("/cart-beans")
    public class CartBeanController {
        @Autowired
        private CartBeanService service;

        @GetMapping("/customer/{id}")
        public CartBean getByCustomer_Id(@PathVariable("id") String id) {
            return service.getByCustomer_Id(id);
        }

        @PostMapping("/add/{customerId}/{roomNumber}")
        public ResponseEntity<String> addRoomToCart(@PathVariable("customerId") String customerId, 
                                                      @PathVariable("roomNumber") String roomNumber) {
            boolean success = service.addRoomToCart(customerId, roomNumber);
            if (success) {
                return ResponseEntity.ok("Room added to cart");
            } else {
                return ResponseEntity.badRequest().body("Failed to add room to cart");
            }
        }

        @DeleteMapping("/remove/{customerId}/{roomNumber}")
        public ResponseEntity<String> removeRoomFromCart(@PathVariable("customerId") String customerId,
                                                           @PathVariable("roomNumber") String roomNumber) {
            boolean success = service.removeRoomFromCart(customerId, roomNumber);
            if (success) {
                return ResponseEntity.ok("Room removed from cart");
            } else {
                return ResponseEntity.badRequest().body("Failed to remove room from cart");
            }
        }
    }
