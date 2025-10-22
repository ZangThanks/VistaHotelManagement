const EarlyTab = ({ onViewDetails }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-cream-100">
            <th className="p-4 text-left font-semibold">Request ID</th>
            <th className="p-4 text-left font-semibold">Guest Name</th>
            <th className="p-4 text-left font-semibold">Room</th>
            <th className="p-4 text-left font-semibold">Regular Check-in</th>
            <th className="p-4 text-left font-semibold">Requested Time</th>
            <th className="p-4 text-left font-semibold">Early Fee</th>
            <th className="p-4 text-left font-semibold">Status</th>
            <th className="p-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-cream-100 hover:bg-cream-50">
            <td className="p-4">ER-23062501</td>
            <td className="p-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/women/12.jpg"
                  alt="Guest"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gold-300"
                />
                <div className="flex flex-col">
                  <span className="font-medium">Olivia Davis</span>
                  <span className="text-sm text-gray-500">
                    olivia.d@example.com
                  </span>
                </div>
              </div>
            </td>
            <td className="p-4">302 - Deluxe King</td>
            <td className="p-4">14:00 PM</td>
            <td className="p-4">10:30 AM</td>
            <td className="p-4">$65 (30%)</td>
            <td className="p-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-600">
                Pending
              </span>
            </td>
            <td className="p-4">
              <div className="flex gap-1">
                <button
                  className="p-2 rounded-full hover:bg-green-100 text-green-600"
                  title="Approve"
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
                  className="p-2 rounded-full hover:bg-red-100 text-red-600"
                  title="Reject"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
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
            <td className="p-4">ER-23062502</td>
            <td className="p-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/men/77.jpg"
                  alt="Guest"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gold-300"
                />
                <div className="flex flex-col">
                  <span className="font-medium">Michael Chen</span>
                  <span className="text-sm text-gray-500">
                    michael.c@example.com
                  </span>
                </div>
              </div>
            </td>
            <td className="p-4">506 - Suite</td>
            <td className="p-4">14:00 PM</td>
            <td className="p-4">07:00 AM</td>
            <td className="p-4">$125 (50%)</td>
            <td className="p-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
                Approved
              </span>
            </td>
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
            <td className="p-4">ER-23062503</td>
            <td className="p-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/women/32.jpg"
                  alt="Guest"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gold-300"
                />
                <div className="flex flex-col">
                  <span className="font-medium">Amanda Wilson</span>
                  <span className="text-sm text-gray-500">
                    amanda.w@example.com
                  </span>
                </div>
              </div>
            </td>
            <td className="p-4">205 - Standard Twin</td>
            <td className="p-4">14:00 PM</td>
            <td className="p-4">11:30 AM</td>
            <td className="p-4">$45 (30%)</td>
            <td className="p-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
                Room Unavailable
              </span>
            </td>
            <td className="p-4">
              <div className="flex gap-1">
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
                <button
                  className="p-2 rounded-full hover:bg-cream-100"
                  title="Send Message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
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

export default EarlyTab;
