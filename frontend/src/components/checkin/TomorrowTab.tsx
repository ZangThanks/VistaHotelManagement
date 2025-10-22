import React from "react";

const TomorrowTab = ({ onViewDetails }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-cream-100">
            <th className="p-4 text-left font-semibold">Booking ID</th>
            <th className="p-4 text-left font-semibold">Guest Name</th>
            <th className="p-4 text-left font-semibold">Room</th>
            <th className="p-4 text-left font-semibold">Check-in Time</th>
            <th className="p-4 text-left font-semibold">Status</th>
            <th className="p-4 text-left font-semibold">Trust Score</th>
            <th className="p-4 text-left font-semibold">Payment Status</th>
            <th className="p-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-cream-100 hover:bg-cream-50">
            <td className="p-4">VH-23062601</td>
            <td className="p-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/men/22.jpg"
                  alt="Guest"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gold-300"
                />
                <div className="flex flex-col">
                  <span className="font-medium">David Miller</span>
                  <span className="text-sm text-gray-500">
                    david.m@example.com
                  </span>
                </div>
              </div>
            </td>
            <td className="p-4">305 - Deluxe King</td>
            <td className="p-4">14:00 PM</td>
            <td className="p-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                Upcoming
              </span>
            </td>
            <td className="p-4">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
                  <span className="text-sm font-semibold">75</span>
                </div>
                <div className="text-xs text-center mt-1">Medium</div>
              </div>
            </td>
            <td className="p-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-600">
                Partial (30%)
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
          <tr className="border-b border-cream-100 hover:bg-cream-50">
            <td className="p-4">VH-23062602</td>
            <td className="p-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/women/36.jpg"
                  alt="Guest"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gold-300"
                />
                <div className="flex flex-col">
                  <span className="font-medium">Jessica Brown</span>
                  <span className="text-sm text-gray-500">
                    jessica.b@example.com
                  </span>
                </div>
              </div>
            </td>
            <td className="p-4">410 - Suite</td>
            <td className="p-4">15:00 PM</td>
            <td className="p-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                Upcoming
              </span>
            </td>
            <td className="p-4">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <span className="text-sm font-semibold">95</span>
                </div>
                <div className="text-xs text-center mt-1">High</div>
              </div>
            </td>
            <td className="p-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-600">
                Pay at Checkout
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

export default TomorrowTab;
