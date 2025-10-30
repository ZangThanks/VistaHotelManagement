import type { RoomFormData } from "../components/room/AddRoomModal";

export interface ValidationError {
    field: string;
    message: string;
}

/**
 * Validate dữ liệu của tab thông tin chi tiết phòng
 */
export const validateRoomDetails = (
    formData: RoomFormData
): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!formData.roomNumber.trim()) {
        errors.push({
          field: "roomNumber",
          message: "Room number is required",
        });
    }

    if (!formData.floor) {
        errors.push({
            field: "floor",
            message: "Floor is required",
        });
    } else if (parseInt(formData.floor) < 1) {
        errors.push({
          field: "floor",
          message: "Floor must be greater than 0",
        });
    }

    if (!formData.roomStatus) {
        errors.push({
            field: "roomStatus",
            message: "Room status is required",
        });
    }

    if (!formData.lastCleaned) {
        errors.push({
            field: "lastCleaned",
            message: "Last cleaned date is required",
        });
    }

    return errors;
}

/**
 * Valid dữ liệu tab Room type
 */
export const validateRoomType = (formData: RoomFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!formData.roomTypeId) {
    errors.push({
      field: "roomTypeId",
      message: "Room type is required",
    });
  }

  if (!formData.typeName.trim()) {
    errors.push({
      field: "typeName",
      message: "Type name is required",
    });
  }

  if (!formData.area) {
    errors.push({
      field: "area",
      message: "Area is required",
    });
  } else if (parseFloat(formData.area) <= 0) {
    errors.push({
      field: "area",
      message: "Area must be greater than 0",
    });
  }

  if (!formData.maxOccupancy) {
    errors.push({
      field: "maxOccupancy",
      message: "Max occupancy is required",
    });
  } else if (parseInt(formData.maxOccupancy) < 1) {
    errors.push({
      field: "maxOccupancy",
      message: "Max occupancy must be at least 1",
    });
  }

  if (!formData.basePrice) {
    errors.push({
      field: "basePrice",
      message: "Base price is required",
    });
  } else if (parseFloat(formData.basePrice) <= 0) {
    errors.push({
      field: "basePrice",
      message: "Base price must be greater than 0",
    });
  }

  if (!formData.description.trim()) {
    errors.push({
      field: "description",
      message: "Description is required",
    });
  }

  return errors;
};

/**
 * Validate tab Amenities
 */
export const validateAmenities = (
  formData: RoomFormData
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (formData.amenities.length === 0) {
    errors.push({
      field: "amenities",
      message: "At least one amenity should be selected",
    });
  }

  return errors;
};

/**
 * Valid tab Images
 */
export const validateImages = (formData: RoomFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (formData.imageUrls.length === 0 && formData.imageFiles.length === 0) {
    errors.push({
      field: "images",
      message: "At least one image is required",
    });
  }

  return errors;
};

/**
 * Validate dữ liệu dựa trên tab hiện tại
 */
export const validateTab = (
  tabId: string,
  formData: RoomFormData
): ValidationError[] => {
  switch (tabId) {
    case "details":
      return validateRoomDetails(formData);
    case "type":
      return validateRoomType(formData);
    case "amenities":
      return validateAmenities(formData);
    case "images":
      return validateImages(formData);
    default:
      return [];
  }
};