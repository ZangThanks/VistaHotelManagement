package com.hotelvista.controller;

import com.hotelvista.model.PromotionType;
import com.hotelvista.service.PromotionTypeService;
import com.hotelvista.util.ValidatorsUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/promotion-types")
public class PromotionTypeController {
    @Autowired
    private PromotionTypeService promotionTypeService;

    @GetMapping
    public ResponseEntity<List<PromotionType>> findAll() {
        try {
            List<PromotionType> types = promotionTypeService.findAll();
            return ResponseEntity.ok(types);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromotionType> findById(@PathVariable String id) {
        try {
            PromotionType type = promotionTypeService.findById(id);
            if (type == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(type);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<PromotionType> save(@RequestBody PromotionType promotionType) {
        try {
            // Validate
            String idError = ValidatorsUtil.validatePromotionId(promotionType.getPromotionTypeID());
            if (idError != null) {
                return ResponseEntity.badRequest().build();
            }

            String nameError = ValidatorsUtil.validatePromotionTypeName(promotionType.getPromotionTYPEName());
            if (nameError != null) {
                return ResponseEntity.badRequest().build();
            }

            // Kiểm tra trùng ID
            if (promotionTypeService.exists(promotionType.getPromotionTypeID())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }

            PromotionType created = promotionTypeService.save(promotionType);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionType> update(
            @PathVariable String id,
            @RequestBody PromotionType promotionType) {
        try {
            // Kiểm tra tồn tại
            if (!promotionTypeService.exists(id)) {
                return ResponseEntity.notFound().build();
            }

            // Validate
            String nameError = ValidatorsUtil.validatePromotionTypeName(promotionType.getPromotionTYPEName());
            if (nameError != null) {
                return ResponseEntity.badRequest().build();
            }

            PromotionType updated = promotionTypeService.update(id, promotionType);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            if (!promotionTypeService.exists(id)) {
                return ResponseEntity.notFound().build();
            }

            promotionTypeService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
}
