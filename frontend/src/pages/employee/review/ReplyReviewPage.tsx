import type React from "react";
import { useEffect, useState } from "react";
import type { Review } from "../../../types/Review";
import { getAllRooms } from "../../../services/roomService";
import type { Room } from "../../../types/Room";
import { getReviewsByRoomNumber } from "../../../services/reviewService";

const ReplyReviewPage: React.FC = () => {
  const [reviews, setReviews] = useState<Record<string, Review[]>>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const roomData = await getAllRooms();
      setRooms(roomData);

      rooms.forEach(async (room) => {
        const reviewData = await getReviewsByRoomNumber(room.roomNumber);
        setReviews(reviewData);
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <div></div>;
};

export default ReplyReviewPage;
