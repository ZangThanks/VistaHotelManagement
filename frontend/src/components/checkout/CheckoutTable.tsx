export default function CheckoutTable({
  activeTab,
  onProcessCheckout,
  onViewDetails,
}: {
  activeTab: string;
  onProcessCheckout: (bookingId: string) => void;
  onViewDetails: () => void;
}) {
  const checkoutData = [
    {
      bookingId: "VH-23062801",
      guestInfo: {
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        image: "https://randomuser.me/api/portraits/women/42.jpg",
      },
      room: "301 - Deluxe King",
      checkoutTime: "12:00 PM",
      status: "pending",
      trustScore: { score: 92, level: "high" },
      balanceDue: "850,000 VND",
      actions: ["checkout", "view"],
    },
    {
      bookingId: "VH-23062802",
      guestInfo: {
        name: "Robert Smith",
        email: "robert.s@example.com",
        image: "https://randomuser.me/api/portraits/men/28.jpg",
      },
      room: "212 - Standard Twin",
      checkoutTime: "11:30 AM",
      status: "completed",
      trustScore: { score: 75, level: "medium" },
      balanceDue: "0 VND",
      actions: ["view", "receipt"],
    },
    {
      bookingId: "VH-23062803",
      guestInfo: {
        name: "James Wilson",
        email: "james.w@example.com",
        image: "https://randomuser.me/api/portraits/men/62.jpg",
      },
      room: "508 - Suite",
      checkoutTime: "12:00 PM",
      status: "pending",
      trustScore: { score: 32, level: "low" },
      balanceDue: "1,250,000 VND",
      actions: ["checkout", "view"],
    },
    {
      bookingId: "VH-23062804",
      guestInfo: {
        name: "Emma Davis",
        email: "emma.d@example.com",
        image: "https://randomuser.me/api/portraits/women/56.jpg",
      },
      room: "405 - Deluxe Twin",
      checkoutTime: "10:30 AM",
      status: "completed",
      trustScore: { score: 88, level: "high" },
      balanceDue: "0 VND",
      actions: ["view", "receipt"],
    },
  ];

  const renderTrustScore = (score: number, level: string) => {
    const bgColors = {
      high: "bg-green-50 text-success",
      medium: "bg-amber-50 text-amber-600",
      low: "bg-red-50 text-danger",
    };
    const color = bgColors[level as keyof typeof bgColors] || bgColors.medium;

    return (
      <div className={`rounded-md py-1 px-2 text-center ${color}`}>
        <span className="block font-semibold">{score}</span>
        <div className="text-xs">{level[0].toUpperCase() + level.slice(1)}</div>
      </div>
    );
  };

  const statusColors = {
    pending: "bg-amber-50 text-amber-600",
    completed: "bg-green-50 text-success",
  };

  return (
    <div className="bg-white rounded-md overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cream">
            <tr>
              <th className="text-left py-4 px-4 font-semibold">Booking ID</th>
              <th className="text-left py-4 px-4 font-semibold">Guest Name</th>
              <th className="text-left py-4 px-4 font-semibold">Room</th>
              <th className="text-left py-4 px-4 font-semibold">
                Check-out Time
              </th>
              <th className="text-left py-4 px-4 font-semibold">Status</th>
              <th className="text-left py-4 px-4 font-semibold">Trust Score</th>
              <th className="text-left py-4 px-4 font-semibold">Balance Due</th>
              <th className="text-left py-4 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {checkoutData.map((item, index) => (
              <tr key={index} className="hover:bg-light/50">
                <td className="py-4 px-4 border-b border-light">
                  {item.bookingId}
                </td>
                <td className="py-4 px-4 border-b border-light">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.guestInfo.image}
                      alt={item.guestInfo.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <span className="block font-medium">
                        {item.guestInfo.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.guestInfo.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 border-b border-light">{item.room}</td>
                <td className="py-4 px-4 border-b border-light">
                  {item.checkoutTime}
                </td>
                <td className="py-4 px-4 border-b border-light">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[item.status as keyof typeof statusColors]
                    }`}
                  >
                    {item.status === "pending" ? "Pending" : "Completed"}
                  </span>
                </td>
                <td className="py-4 px-4 border-b border-light">
                  {renderTrustScore(
                    item.trustScore.score,
                    item.trustScore.level
                  )}
                </td>
                <td className="py-4 px-4 border-b border-light">
                  {item.balanceDue}
                </td>
                <td className="py-4 px-4 border-b border-light">
                  <div className="flex gap-2">
                    {item.actions.includes("checkout") && (
                      <button
                        onClick={() => onProcessCheckout(item.bookingId)}
                        className="w-8 h-8 bg-light hover:bg-cream rounded-full flex items-center justify-center"
                        title="Process Check-out"
                      >
                        <i className="fas fa-cash-register"></i>
                      </button>
                    )}

                    {item.actions.includes("view") && (
                      <button
                        onClick={onViewDetails}
                        className="w-8 h-8 bg-light hover:bg-cream rounded-full flex items-center justify-center"
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    )}

                    {item.actions.includes("receipt") && (
                      <button
                        className="w-8 h-8 bg-light hover:bg-cream rounded-full flex items-center justify-center"
                        title="Print Receipt"
                      >
                        <i className="fas fa-receipt"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
