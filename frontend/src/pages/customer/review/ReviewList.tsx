/* eslint-disable */
import { useEffect, useState } from "react";
import BookingCard from "./BookingCard";
import ReviewModal from "./ReviewModal";
import type { Review } from "../../../types/Review";
import type { BookingDetail } from "../../../types/BookingDetail";
import { getBookingDetailsById } from "../../../services/bookingDetailService";
import { saveReview } from "../../../services/reviewService";
import { uploadReviewImagesToCloudinary } from "../../../services/cloudinaryService";
import { useParams } from "react-router-dom";
import type { Booking } from "../../../types/Booking";
import { getBookingById } from "../../../services/bookingService";

interface ReviewModalState {
  isOpen: boolean;
  bookingDetail: BookingDetail | null;
  bookingID: string | null;
}

export default function ReviewsList() {
  const { id } = useParams();
  const [reviews, setReviews] = useState<Record<string, Review>>({});
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [booking, setBooking] = useState<Booking>();
  const [modalState, setModalState] = useState<ReviewModalState>({
    isOpen: false,
    bookingDetail: null,
    bookingID: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (!id) return;

      const bookingData = await getBookingById(id);
      setBooking(bookingData);

      const bdData = await getBookingDetailsById(id);
      setBookingDetails(bdData);

      // Load reviews đã có từ bookingDetails
      const existingReviews: Record<string, Review> = {};
      bdData.forEach((bd) => {
        if (bd.review) {
          const reviewKey = `${bookingData.bookingID}-${bd.room.roomNumber}`;
          existingReviews[reviewKey] = bd.review;
        }
      });
      setReviews(existingReviews);

      setLoading(false);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenReview = (
    bookingID: string,
    bookingDetail: BookingDetail
  ) => {
    //Không mở modal nếu đã có review
    const reviewKey = `${bookingID}-${bookingDetail.room.roomNumber}`;
    if (reviews[reviewKey]) {
      return;
    }

    setModalState({
      isOpen: true,
      bookingDetail,
      bookingID,
    });
  };

  const handleCloseReview = () => {
    setModalState({
      isOpen: false,
      bookingDetail: null,
      bookingID: null,
    });
  };

  const handleSubmitReview = async (reviewData: any) => {
    if (!modalState.bookingID || !modalState.bookingDetail) {
      alert("Missing booking information");
      return;
    }

    try {
      const bookingID = modalState.bookingID;
      const roomNumber = modalState.bookingDetail.room.roomNumber;

      // Upload ảnh đến Cloudinary nếu có
      let imageUrls: string[] = [];
      if (reviewData.imageFiles && reviewData.imageFiles.length > 0) {
        console.log(
          "Uploading",
          reviewData.imageFiles.length,
          "images to Cloudinary..."
        );
        try {
          imageUrls = await uploadReviewImagesToCloudinary(
            reviewData.imageFiles
          );
          console.log("Successfully uploaded image URLs:", imageUrls);
        } catch (uploadError) {
          console.error("Failed to upload images:", uploadError);
          alert("Failed to upload images. Please try again.");
          return;
        }
      }

      const reviewPayload = {
        rating: reviewData.rating,
        roomQuantity: reviewData.roomQuality,
        serviceQuality: reviewData.serviceQuality,
        location: reviewData.location,
        valueForMoney: reviewData.valueForMoney,
        comment: reviewData.comment,
        isAnonymous: reviewData.isAnonymous,
        images: imageUrls,
      };

      console.log("Saving review with payload:", reviewPayload);
      console.log("For booking:", bookingID, "Room:", roomNumber);

      const savedReview = await saveReview(
        reviewPayload,
        bookingID,
        roomNumber
      );

      console.log("Review saved successfully:", savedReview);

      setReviews((prev) => ({
        ...prev,
        [`${bookingID}-${roomNumber}`]: { ...reviewData, images: imageUrls },
      }));

      alert("Review submitted successfully!");
      handleCloseReview();
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save review. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {bookingDetails.map((bd) => (
        <div key={bd.room.roomNumber}>
          <BookingCard
            booking={booking!}
            reviews={reviews}
            onReviewClick={(bookingDetail) =>
              handleOpenReview(booking!.bookingID, bookingDetail)
            }
          />
        </div>
      ))}

      {modalState.isOpen && modalState.bookingDetail && (
        <ReviewModal
          isOpen={modalState.isOpen}
          bookingDetail={modalState.bookingDetail}
          onClose={handleCloseReview}
          onSubmit={handleSubmitReview}
          existingReview={
            reviews[
              `${modalState.bookingID}-${modalState.bookingDetail?.room.roomNumber}`
            ]
          }
        />
      )}
    </div>
  );
}
