const HourlyTab = ({ onViewDetails }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-cream-100">
            <th className="p-4 text-left font-semibold">Booking ID</th>
            <th className="p-4 text-left font-semibold">Guest Name</th>
            <th className="p-4 text-left font-semibold">Room</th>
            <th className="p-4 text-left font-semibold">Duration</th>
            <th className="p-4 text-left font-semibold">Check-in Time</th>
            <th className="p-4 text-left font-semibold">Check-out Time</th>
            <th className="p-4 text-left font-semibold">Rate</th>
            <th className="p-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-cream-100 hover:bg-cream-50">
            <td className="p-4">HR-23062501</td>
            <td className="p-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/men/52.jpg"
                  alt="Guest"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gold-300"
                />
                <div className="flex flex-col">
                  <span className="font-medium">Thomas Harris</span>
                  <span className="text-sm text-gray-500">
                    thomas.h@example.com
                  </span>
                </div>
              </div>
            </td>
            <td className="p-4">210 - Standard King</td>
            <td className="p-4">4 hours</td>
            <td className="p-4">13:00 PM</td>
            <td className="p-4">17:00 PM</td>
            <td className="p-4">$45 (45%)</td>
            <td className="p-4">
              <div className="flex gap-1">
                <button
                  className="p-2 rounded-full hover:bg-green-100 text-green-600"
                  title="Check In"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onViewDetails()}
                  className="p-2 rounded-full hover:bg-cream-100"
                  title="View Details"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr className="border-b border-cream-100 hover:bg-cream-50">
            <td className="p-4">HR-23062502</td>
            <td className="p-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Guest"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gold-300"
                />
                <div className="flex flex-col">
                  <span className="font-medium">Lisa Taylor</span>
                  <span className="text-sm text-gray-500">
                    lisa.t@example.com
                  </span>
                </div>
              </div>
            </td>
            <td className="p-4">307 - Deluxe King</td>
            <td className="p-4">6 hours</td>
            <td className="p-4">10:00 AM</td>
            <td className="p-4">16:00 PM</td>
            <td className="p-4">$78 (65%)</td>
            <td className="p-4">
              <div className="flex gap-1">
                <button
                  className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                  title="Check Out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600"
                  title="Extend Stay"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onViewDetails()}
                  className="p-2 rounded-full hover:bg-cream-100"
                  title="View Details"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HourlyTab;
