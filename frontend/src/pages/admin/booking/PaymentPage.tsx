import { useEffect, useState } from "react";
import { generateQRPayment } from "../../../services/bookingService";

const PaymentPage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>("");

  const fetchImage = async () => {
    try {
      const blob = await generateQRPayment("B1911250001");
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      console.error("Error fetching payment image:", error);
    }
  };

  useEffect(() => {
    fetchImage();

    // Cleanup blob URL when component unmounts
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">Payment Page</h1>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Payment QR Code"
          className="max-w-md border rounded shadow"
        />
      ) : (
        <div className="text-gray-500">Loading payment QR code...</div>
      )}
    </div>
  );
};

export default PaymentPage;
