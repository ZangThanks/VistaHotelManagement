import React, { useState, useEffect } from "react";
import { FaIdCard, FaCamera } from "react-icons/fa";

export interface IDCardInfo {
  idNumber: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  placeOfOrigin: string;
  placeOfResidence: string;
  expiryDate: string;
}

interface IDScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (idInfo: IDCardInfo) => void;
  bookingID?: string;
  customerID?: string;
}

function IDScannerModal({
  isOpen,
  onClose,
  onComplete,
  bookingID,
  customerID,
}: IDScannerModalProps) {
  const [selectedCamera, setSelectedCamera] = useState("");
  const [availableCameras, setAvailableCameras] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedIDInfo, setScannedIDInfo] = useState<IDCardInfo | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const cameras = [
        "Camera 1 - Front Camera",
        "Camera 2 - Back Camera",
        "Camera 3 - USB Camera",
        "Scanner 1 - Document Scanner",
      ];
      setAvailableCameras(cameras);
      setSelectedCamera(cameras[0]);

      setScannedIDInfo(null);
      setScanProgress(0);
      setIsScanning(false);
    }
  }, [isOpen]);

  const handleStartScan = () => {
    if (!selectedCamera) {
      alert("Please select a camera device");
      return;
    }

    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);

          const mockIDData: IDCardInfo = {
            idNumber: "001234567890",
            fullName: "NGUYỄN VĂN A",
            dateOfBirth: "01/01/1990",
            gender: "Nam",
            nationality: "Việt Nam",
            placeOfOrigin: "Hà Nội",
            placeOfResidence: "123 Đường ABC, Quận 1, TP.HCM",
            expiryDate: "01/01/2035",
          };

          console.log("Scanning for Booking ID:", bookingID);
          console.log("Scanning for Customer ID:", customerID);

          setScannedIDInfo(mockIDData);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleComplete = () => {
    if (!scannedIDInfo) {
      alert("Please scan ID card first");
      return;
    }

    onComplete(scannedIDInfo);
  };

  const handleClose = () => {
    setScannedIDInfo(null);
    setScanProgress(0);
    setIsScanning(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 z-[60]"
        onClick={handleClose}
      ></div>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-[modalFadeIn_0.3s] my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 border-b border-[#EBE3D7] sticky top-0 bg-white z-10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaIdCard className="text-[#CCBDA3] text-2xl" />
              <h3 className="text-2xl font-playfair font-semibold">
                Scan ID Card
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-2xl text-gray-500 hover:text-black"
            >
              &times;
            </button>
          </div>

          <div className="p-6">
            {(bookingID || customerID) && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                {bookingID && (
                  <div>
                    <span className="text-gray-600">Booking ID:</span>{" "}
                    <span className="font-medium text-blue-700">
                      {bookingID}
                    </span>
                  </div>
                )}
                {customerID && (
                  <div>
                    <span className="text-gray-600">Customer ID:</span>{" "}
                    <span className="font-medium text-blue-700">
                      {customerID}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Select Camera/Scanner Device
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="flex-1 p-2.5 border border-[#EBE3D7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#CCBDA3]"
                  disabled={isScanning}
                >
                  {availableCameras.map((camera, idx) => (
                    <option key={idx} value={camera}>
                      {camera}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStartScan}
                  disabled={isScanning || !selectedCamera}
                  className="px-6 py-2.5 bg-[#CCBDA3] text-white rounded-md hover:bg-[#b8ac94] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FaCamera />
                  {isScanning ? "Scanning..." : "Start Scan"}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div
                className="relative bg-gray-100 rounded-lg overflow-hidden"
                style={{ height: "300px" }}
              >
                {!isScanning && !scannedIDInfo && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <FaIdCard className="text-6xl mb-3" />
                    <p className="text-lg">Place ID card in front of camera</p>
                    <p className="text-sm">Click "Start Scan" to begin</p>
                  </div>
                )}

                {isScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-64 h-40 border-4 border-[#CCBDA3] border-dashed rounded-lg animate-pulse"></div>
                    <div className="mt-4 w-64">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#CCBDA3] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-center mt-2 text-sm text-gray-600">
                        Scanning... {scanProgress}%
                      </p>
                    </div>
                  </div>
                )}

                {scannedIDInfo && (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
                      <div className="flex items-center gap-2 mb-3 text-green-600">
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-semibold">Scan Successful!</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="col-span-2">
                          <span className="text-gray-600">ID Number:</span>{" "}
                          <span className="font-medium">
                            {scannedIDInfo.idNumber}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Full Name:</span>{" "}
                          <span className="font-medium">
                            {scannedIDInfo.fullName}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">DOB:</span>{" "}
                          <span className="font-medium">
                            {scannedIDInfo.dateOfBirth}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Gender:</span>{" "}
                          <span className="font-medium">
                            {scannedIDInfo.gender}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {scannedIDInfo && (
              <div className="bg-[#F5F0EB] p-4 rounded-lg">
                <h4 className="font-semibold mb-3">ID Card Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">ID Number:</span>{" "}
                    <span className="font-medium">
                      {scannedIDInfo.idNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Full Name:</span>{" "}
                    <span className="font-medium">
                      {scannedIDInfo.fullName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date of Birth:</span>{" "}
                    <span className="font-medium">
                      {scannedIDInfo.dateOfBirth}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Gender:</span>{" "}
                    <span className="font-medium">{scannedIDInfo.gender}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Nationality:</span>{" "}
                    <span className="font-medium">
                      {scannedIDInfo.nationality}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expiry Date:</span>{" "}
                    <span className="font-medium">
                      {scannedIDInfo.expiryDate}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Place of Origin:</span>{" "}
                    <span className="font-medium">
                      {scannedIDInfo.placeOfOrigin}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Place of Residence:</span>{" "}
                    <span className="font-medium">
                      {scannedIDInfo.placeOfResidence}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-[#EBE3D7] bg-[#F5F0EB]/30 flex justify-end gap-3 sticky bottom-0 bg-white">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 border border-[#EBE3D7] rounded-md hover:bg-[#EBE3D7]/50 transition font-medium"
            >
              Cancel
            </button>
            {scannedIDInfo && (
              <button
                onClick={handleStartScan}
                className="px-6 py-2.5 border border-[#CCBDA3] text-[#CCBDA3] rounded-md hover:bg-[#CCBDA3]/10 transition font-medium"
              >
                Rescan
              </button>
            )}
            <button
              onClick={handleComplete}
              disabled={!scannedIDInfo}
              className="px-6 py-2.5 bg-[#CCBDA3] text-white rounded-md hover:bg-[#b8ac94] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm & Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default IDScannerModal;
