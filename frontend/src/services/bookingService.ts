import axios from "axios";

const API_URL = "http://localhost:8080/bookings";

export const getAll = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

//TEst:
// export const getAll = async () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(sampleData);
//     }, 800);
//   });
// };

// export const getById = async (id) => {

//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const booking = sampleData.find((b) => b.bookingID === id);
//       if (booking) {
//         resolve(booking);
//       } else {
//         reject(new Error("Booking not found"));
//       }
//     }, 300);
//   });
// };

// export const createBooking = async (bookingData) => {

//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         success: true,
//         bookingID: `BOOK${Math.floor(1000 + Math.random() * 9000)}`,
//         ...bookingData,
//       });
//     }, 500);
//   });
// };

// export const updateBookingStatus = async (id, status) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         success: true,
//         bookingID: id,
//         status,
//       });
//     }, 300);
//   });
// };
// >>>>>>> PPH
