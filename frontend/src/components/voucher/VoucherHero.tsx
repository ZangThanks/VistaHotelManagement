import { motion } from 'framer-motion';
import { FaStar, FaGift, FaClock } from 'react-icons/fa';

interface VoucherHeroProps {
    stats: {
        total: number;
        active: number;
        expiring: number;
    };
}

const VoucherHero: React.FC<VoucherHeroProps> = ({ stats }) => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#c3923c] via-[#b4893e] to-[#ccbda3] text-white">
            {/* Pattern Background */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                ></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-3">
                        <FaStar className="text-yellow-300 text-sm" />
                        <span className="text-sm font-medium">
                            Your Exclusive Rewards
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                        My Vouchers
                    </h1>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto">
                        Unlock amazing savings and exclusive deals
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-3 gap-3 mt-8 max-w-2xl mx-auto"
                >
                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center border border-white/30">
                        <FaGift className="text-2xl mx-auto mb-1" />
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <div className="text-xs text-white/80 mt-1">Total</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center border border-white/30">
                        <FaStar className="text-2xl mx-auto mb-1 text-yellow-300" />
                        <div className="text-2xl font-bold">{stats.active}</div>
                        <div className="text-xs text-white/80 mt-1">Active</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center border border-white/30">
                        <FaClock className="text-2xl mx-auto mb-1 text-orange-300" />
                        <div className="text-2xl font-bold">
                            {stats.expiring}
                        </div>
                        <div className="text-xs text-white/80 mt-1">
                            Expiring
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1440 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto"
                >
                    <path
                        d="M0 0L60 8C120 16 240 32 360 37.3C480 43 600 37 720 34.7C840 32 960 32 1080 37.3C1200 43 1320 53 1380 58.7L1440 64V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V0Z"
                        fill="#f5f0eb"
                    />
                </svg>
            </div>
        </div>
    );
};

export default VoucherHero;
