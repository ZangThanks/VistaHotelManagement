import React from 'react';

interface CheckinTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    counts?: {
        today: number;
        tomorrow: number;
        early: number;
        hourly: number;
    };
}

const CheckinTabs: React.FC<CheckinTabsProps> = ({
    activeTab,
    onTabChange,
    counts,
}) => {
    const tabs = [
        { id: 'today', label: "Today's Check-ins", count: counts?.today },
        {
            id: 'tomorrow',
            label: "Tomorrow's Check-ins",
            count: counts?.tomorrow,
        },
        { id: 'early', label: 'Early Check-in Requests', count: counts?.early },
        { id: 'hourly', label: 'Hourly Bookings', count: counts?.hourly },
    ];

    return (
        <div className="flex flex-wrap border-b border-[#EBE3D7]">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`py-3 px-4 font-medium text-sm transition-colors focus:outline-none flex items-center gap-2
            ${
                activeTab === tab.id
                    ? 'text-[#CCBDA3] border-b-2 border-[#CCBDA3]'
                    : 'text-gray-600 hover:text-gray-900'
            }`}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                activeTab === tab.id
                                    ? 'bg-[#CCBDA3] text-white'
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default CheckinTabs;
