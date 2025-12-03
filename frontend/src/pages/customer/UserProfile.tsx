import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaTrophy,
  FaHistory,
  FaTicketAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import type {
  UserProfile,
  ProfileUpdateRequest,
  PasswordChangeRequest,
} from "../../types/UserProfile";
import type { Booking } from "../../types/Booking";
import userProfileService from "../../services/userProfileService";
import ProfileInfoSection from "../../components/profile/ProfileInfoSection";
import PasswordChangeSection from "../../components/profile/PasswordChangeSection";
import MembershipInfoSection from "../../components/profile/MembershipInfoSection";
import BookingHistorySection from "../../components/profile/BookingHistorySection";
import ConfirmDialog from "../../components/dialog/ConfirmDialog";
import { useToastContext } from "../../hooks/useToastContext";
import { handleLogout } from "../../services/authService";
import { getVouchersByCustomerId } from "../../services/voucherService";
import type { Voucher } from "../../types/Voucher";
import VoucherHero from "../../components/voucher/VoucherHero";
import VoucherFilter from "../../components/voucher/VoucherFilter";
import VoucherCard from "../../components/voucher/VoucherCard";
import EmptyVoucher from "../../components/voucher/EmptyVoucher";
import { AnimatePresence } from "framer-motion";
import { changePassword } from "../../services/authService";

type MenuTab = "profile" | "password" | "membership" | "bookings" | "vouchers";

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastContext();
  const [activeTab, setActiveTab] = useState<MenuTab>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [vouchersLoading, setVouchersLoading] = useState(false);
  const [voucherFilter, setVoucherFilter] = useState<
    "all" | "active" | "expiring"
  >("all");
  const [copiedCode, setCopiedCode] = useState<string>("");

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === "bookings" && profile?.userRole === "CUSTOMER") {
      loadBookings();
    }
    if (activeTab === "vouchers" && profile?.userRole === "CUSTOMER") {
      loadVouchers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, profile]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const user = userProfileService.getCurrentUserFromStorage();

      if (!user) {
        toast.error("Please login!");
        navigate("/auth/login");
        return;
      }

      // Fetch fresh data from API
      if (user.userRole === "CUSTOMER") {
        const customerData = await userProfileService.getCustomerProfile(
          user.id
        );
        setProfile(customerData as unknown as UserProfile);
        userProfileService.updateUserInStorage(
          customerData as unknown as UserProfile
        );
      } else {
        setProfile(user);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      // Fallback to localStorage data
      const user = userProfileService.getCurrentUserFromStorage();
      if (user) {
        setProfile(user);
      } else {
        toast.error("Cannot load account information!");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    if (!profile?.id) return;

    try {
      setBookingsLoading(true);
      const data = await userProfileService.getCustomerBookings(profile.id);
      setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Cannot load booking history!");
    } finally {
      setBookingsLoading(false);
    }
  };

  const loadVouchers = async () => {
    if (!profile?.id) return;

    try {
      setVouchersLoading(true);
      const data = await getVouchersByCustomerId(profile.id);
      setVouchers(data);
    } catch (error) {
      console.error("Error loading vouchers:", error);
      toast.error("Cannot load vouchers!");
    } finally {
      setVouchersLoading(false);
    }
  };

  const getFilteredVouchers = () => {
    return vouchers.filter((v) => {
      const { status } = getVoucherStatus(v.endDate);
      if (voucherFilter === "all") return true;
      if (voucherFilter === "active") return status === "active";
      if (voucherFilter === "expiring") return status === "expiring";
      return true;
    });
  };

  const getVoucherStats = () => {
    return {
      total: vouchers.length,
      active: vouchers.filter(
        (v) => getVoucherStatus(v.endDate).status === "active"
      ).length,
      expiring: vouchers.filter(
        (v) => getVoucherStatus(v.endDate).status === "expiring"
      ).length,
    };
  };

  const getVoucherStatus = (
    endDate: Date | string
  ): {
    status: "active" | "expiring" | "expired";
    label: string;
    daysLeft: number;
  } => {
    const now = new Date();
    const end = new Date(endDate);
    const daysUntilExpiry = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (end < now) return { status: "expired", label: "Expired", daysLeft: 0 };
    if (daysUntilExpiry <= 7)
      return {
        status: "expiring",
        label: `${daysUntilExpiry}d left`,
        daysLeft: daysUntilExpiry,
      };
    return { status: "active", label: "Active", daysLeft: daysUntilExpiry };
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const handleUpdateProfile = async (data: ProfileUpdateRequest) => {
    if (!profile) return;

    const updated = await userProfileService.updateCustomerProfile(
      profile.id,
      data
    );
    setProfile(updated as unknown as UserProfile);
    userProfileService.updateUserInStorage(updated as unknown as UserProfile);
  };

  const handleChangePassword = async (data: PasswordChangeRequest) => {
    if (!profile) return;

    await changePassword(profile.id, data);
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    const result = handleLogout();
    if (result.success) {
      toast.success(result.message || "Logged out successfully!");
    }
    setShowLogoutDialog(false);
    navigate("/auth/login");
  };

  const menuItems: { id: MenuTab; label: string; icon: React.JSX.Element }[] = [
    { id: "profile", label: "Personal Information", icon: <FaUser /> },
    { id: "password", label: "Change Password", icon: <FaLock /> },
  ];

  // Add customer-specific menu items
  if (profile?.userRole === "CUSTOMER") {
    menuItems.push(
      { id: "membership", label: "Membership Info", icon: <FaTrophy /> },
      { id: "bookings", label: "Booking History", icon: <FaHistory /> },
      { id: "vouchers", label: "My Vouchers", icon: <FaTicketAlt /> }
    );
  }

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Account</h1>
              <p className="text-white/80">Hello, {profile.fullName}!</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white text-2xl"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Menu */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`lg:w-64 ${sidebarOpen ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white rounded-xl shadow-md border border-cream overflow-hidden sticky top-4">
              <div className="p-6 bg-gradient-to-r from-primary to-secondary text-white">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="text-4xl text-primary" />
                </div>
                <h3 className="text-center font-semibold text-lg">
                  {profile.fullName}
                </h3>
                <p className="text-center text-sm text-white/80">
                  {profile.email}
                </p>
                {profile.userRole === "CUSTOMER" && profile.memberShipLevel && (
                  <div className="mt-3 text-center">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                      {profile.memberShipLevel === "PLATINUM"
                        ? "Platinum"
                        : profile.memberShipLevel === "GOLD"
                        ? "Gold"
                        : profile.memberShipLevel === "SILVER"
                        ? "Silver"
                        : "Bronze"}
                    </span>
                  </div>
                )}
              </div>

              <nav className="p-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
                      activeTab === item.id
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-cream"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}

                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 mt-4"
                >
                  <FaSignOutAlt className="text-xl" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <ProfileInfoSection
                profile={profile}
                onUpdate={handleUpdateProfile}
              />
            )}

            {activeTab === "password" && (
              <PasswordChangeSection onChangePassword={handleChangePassword} />
            )}

            {activeTab === "membership" && profile.userRole === "CUSTOMER" && (
              <MembershipInfoSection profile={profile} />
            )}

            {activeTab === "bookings" && profile.userRole === "CUSTOMER" && (
              <BookingHistorySection
                bookings={bookings}
                loading={bookingsLoading}
              />
            )}

            {activeTab === "vouchers" && (
              <div>
                {vouchersLoading ? (
                  <div className="bg-white rounded-xl shadow-md border border-cream p-6">
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-14 w-14 border-4 border-cream mx-auto"></div>
                          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-primary absolute top-0 left-1/2 -translate-x-1/2"></div>
                        </div>
                        <p className="mt-4 text-gray-700 font-medium text-sm">
                          Loading your vouchers...
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <VoucherHero stats={getVoucherStats()} />

                    <div className="mt-6">
                      <VoucherFilter
                        filter={voucherFilter}
                        onFilterChange={setVoucherFilter}
                      />

                      {getFilteredVouchers().length === 0 ? (
                        <EmptyVoucher />
                      ) : (
                        <div className="space-y-4 mt-4">
                          <AnimatePresence>
                            {getFilteredVouchers().map((voucher, index) => {
                              const { status, label } = getVoucherStatus(
                                voucher.endDate
                              );
                              return (
                                <VoucherCard
                                  key={`${voucher.voucherID}-${index}`}
                                  voucher={voucher}
                                  index={index}
                                  status={status}
                                  label={label}
                                  copiedCode={copiedCode}
                                  onCopy={copyToClipboard}
                                />
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout from your account?"
        type="warning"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </div>
  );
};

export default UserProfilePage;
