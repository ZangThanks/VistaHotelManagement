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
      ? "from-orange-500 to-red-500"
      : "from-[#c3923c] to-[#b4893e]";

  return (
    <motion.div
      key={`${voucher.voucherID}-${index}`}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="relative">
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-[#ebe3d7] hover:border-[#c3923c]">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Compact Discount */}
            <div
              className={`bg-gradient-to-br ${gradientClass} p-5 md:w-48 flex flex-col justify-center items-center text-white relative overflow-hidden`}
            >
              <FaStar className="absolute top-2 right-2 text-white/20 text-lg animate-pulse" />

              <div className="text-center relative z-10">
                {voucher.discountType === "PERCENT" ? (
                  <>
                    <div className="flex items-center justify-center mb-1">
                      <span className="text-5xl font-black">
                        {voucher.discountValue}
                      </span>
                      <FaPercentage className="text-2xl ml-1 mb-2" />
                    </div>
                    <div className="text-lg font-bold tracking-wide">OFF</div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-black mb-1">
                      {voucher.discountValue?.toLocaleString()}đ
                    </div>
                    <div className="text-sm font-bold tracking-wide">
                      DISCOUNT
                    </div>
                  </>
                )}
              </div>

              {/* Punch holes */}
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#f5f0eb] rounded-full"></div>
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#f5f0eb] rounded-full"></div>
            </div>

            {/* Right Side - Details */}
            <div className="flex-1 p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-[#c3923c] transition-colors">
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
                <FaGift className="text-2xl text-[#ccbda3] group-hover:text-[#c3923c] transition-colors" />
              </div>

              {/* Voucher Code */}
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  CODE
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gradient-to-r from-[#f5f0eb] to-[#ebe3d7] border border-[#ccbda3] rounded-lg px-3 py-2">
                    <code className="text-base font-mono font-bold text-[#c3923c] tracking-wider">
                      {voucher.voucherID}
                    </code>
                  </div>
                  <button
                    onClick={() => onCopy(voucher.voucherID)}
                    className={`p-2.5 rounded-lg transition-all duration-300 ${
                      copiedCode === voucher.voucherID
                        ? "bg-green-500 text-white"
                        : "bg-[#ebe3d7] text-[#c3923c] hover:bg-[#ccbda3]"
                    }`}
                    title="Copy code"
                  >
                    {copiedCode === voucher.voucherID ? (
                      <FaCheckCircle />
                    ) : (
                      <FaCopy />
                    )}
                  </button>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-[#c3923c]" />
                  <span>
                    {new Date(voucher.startDate).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <span className="text-[#ebe3d7]">→</span>
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-[#b4893e]" />
                  <span
                    className={
                      status === "expiring" ? "text-orange-600 font-bold" : ""
                    }
                  >
                    {new Date(voucher.endDate).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={status === "expired"}
                className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                  status === "expired"
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#c3923c] to-[#b4893e] text-white hover:from-[#b4893e] hover:to-[#c3923c] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {status === "expired" ? "Expired" : "Use This Voucher"}
              </button>
            </div>
          </div>
        </div>

        {/* Shadow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ccbda3] to-[#c3923c] rounded-xl -z-10 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
      </div>
    </motion.div>
  );
};

export default VoucherCard;
