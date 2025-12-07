import { useState } from 'react';

export default function SearchFilter({
    onSearch,
}: {
    onSearch: (keyword: string) => void;
}) {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const handleSearch = (value: string) => {
        setSearchKeyword(value);
        onSearch(value);
    };

    return (
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by booking ID, guest name or room number..."
                    className="w-full pl-10 pr-4 py-3 border border-cream rounded-md focus:border-gold focus:outline-none"
                />
            </div>

            <div className="flex items-center gap-3">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-cream rounded-md px-3 py-3 focus:border-gold focus:outline-none bg-white"
                >
                    <option value="all">All Check-outs</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="late">Late Requests</option>
                </select>

                <button className="bg-black text-white px-4 py-3 rounded-md flex items-center gap-2 hover:bg-gray-800 transition">
                    <i className="fas fa-filter"></i> Filter
                </button>
            </div>
        </div>
    );
}
