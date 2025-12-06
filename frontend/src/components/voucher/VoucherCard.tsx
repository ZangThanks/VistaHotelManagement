import { motion } from "framer-motion";
import {
  FaStar,
  FaPercentage,
  FaGift,
  FaCheckCircle,
  FaClock,
  FaCopy,
  FaCalendarAlt,
} from "react-icons/fa";
import type { Voucher } from "../../types/Voucher";

interface VoucherCardProps {
  voucher: Voucher;
  index: number;
  status: "active" | "expiring" | "expired";
  label: string;
  copiedCode: string;
  onCopy: (code: string) => void;
}

const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  index,
  status,
  label,
  copiedCode,
  onCopy,
}) => {
  const gradientClass =
    status === "expired"
      ? "from-gray-400 to-gray-500"
      : status === "expiring"
      ? "from-warning to-danger"
      : "from-[#ebe3d7] to-[#d4c4a8]";

  return (
    <motion.div
      key={`${voucher.voucherID}-${index}`}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="relative cursor-pointer">
        <div className="bg-gradient-to-br from-white to-cream/30 rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gold/40 hover:border-gold">
          <div className="flex flex-col sm:flex-row">
            {/* Left Side - Compact Discount */}
            <div
              className={`bg-gradient-to-br ${gradientClass} p-4 sm:p-6 sm:w-52 flex flex-col justify-center items-center text-white relative overflow-hidden shadow-lg`}
            >
              <FaStar className="absolute top-2 sm:top-3 right-2 sm:right-3 text-white text-xl sm:text-2xl animate-pulse" />

              <div className="text-center relative z-10">
                {voucher.discountType === "PERCENT" ? (
                  <>
                    <div className="flex items-center justify-center mb-1">
                      <span className="text-4xl sm:text-5xl font-black">
                        {voucher.discountPercentage}
                      </span>
                      <FaPercentage className="text-xl sm:text-2xl ml-1 mb-2" />
                    </div>
                    <div className="text-base sm:text-lg font-bold tracking-wide">
                      OFF
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl sm:text-3xl font-black mb-1">
                      {voucher.discountValue?.toLocaleString()}đ
                    </div>
                    <div className="text-xs sm:text-sm font-bold tracking-wide">
                      DISCOUNT
                    </div>
                  </>
                )}
              </div>

              {/* Punch holes */}
              <div className="absolute -right-2.5 sm:-right-3 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 bg-cream rounded-full shadow-inner"></div>
              <div className="absolute -left-2.5 sm:-left-3 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 bg-cream rounded-full shadow-inner"></div>
            </div>

            {/* Right Side - Details */}
            <div className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-cream/20 to-transparent">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 group-hover:text-[#ebe3d7] transition-colors line-clamp-1">
                    {voucher.voucherName}
                  </h3>
                  <div className="flex items-center gap-2">
                    {status === "active" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        <FaCheckCircle className="text-xs" />
                        Active
                      </span>
                    )}
                    {status === "expiring" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold animate-pulse">
                        <FaClock className="text-xs" />
                        {label}
                      </span>
                    )}
                    {status === "expired" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        Expired
                      </span>
                    )}
                  </div>
                </div>
                <FaGift className="text-xl sm:text-2xl text-gold group-hover:text-[#ebe3d7] transition-colors flex-shrink-0" />
              </div>

              {/* Voucher Code */}
              <div className="mb-3 sm:mb-4">
                <label className="text-xs font-bold text-gray-700 mb-1.5 sm:mb-2 block uppercase tracking-wider">
                  Voucher Code
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gradient-to-r from-cream to-gold/20 border-2 border-gold/60 rounded-lg px-3 sm:px-4 py-2 sm:py-3 shadow-sm min-w-0">
                    <code className="text-base sm:text-lg font-mono font-bold text-primary tracking-wider truncate block">
                      {voucher.voucherID}
                    </code>
                  </div>
                  <button
                    onClick={() => onCopy(voucher.voucherID)}
                    className={`cursor-pointer p-2 sm:p-3 rounded-lg transition-all duration-300 shadow-sm flex-shrink-0 ${
                      copiedCode === voucher.voucherID
                        ? "bg-success text-white scale-110"
                        : "bg-gold/70 text-white hover:bg-[#ebe3d7]"
                    }`}
                    title="Copy code"
                  >
                    {copiedCode === voucher.voucherID ? (
                      <FaCheckCircle className="text-base sm:text-lg" />
                    ) : (
                      <FaCopy className="text-base sm:text-lg" />
                    )}
                  </button>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 bg-cream/40 rounded-lg py-2 px-2 sm:px-3 flex-wrap">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <FaCalendarAlt className="text-[#ccbda3] text-xs sm:text-sm" />
                  <span className="font-semibold">
                    {new Date(voucher.startDate).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <span className="text-gold font-bold">→</span>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <FaCalendarAlt className="text-[#ccbda3] text-xs sm:text-sm" />
                  <span
                    className={
                      status === "expiring"
                        ? "text-orange-600 font-bold"
                        : "font-semibold"
                    }
                  >
                    {new Date(voucher.endDate).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={status === "expired"}
                className={`cursor-pointer w-full py-2.5 sm:py-3 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 shadow-md ${
                  status === "expired"
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#ccbda3] text-white hover:from-secondary hover:via-primary hover:to-[#ccbda3] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {status === "expired" ? "Expired" : "Use This Voucher"}
              </button>
            </div>
          </div>
        </div>

        {/* Shadow */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold via-primary to-cream rounded-xl -z-10 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
      </div>
    </motion.div>
  );
};

export default VoucherCard;
