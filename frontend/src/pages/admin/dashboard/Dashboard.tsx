import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dashboard Statistics */}
                <div className="lg:col-span-2">
                    <div className="p-6 bg-white rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            📊 Dashboard Statistics
                        </h3>
                        <p className="text-gray-600">
                            Dashboard content will be here...
                        </p>
                        <div className="mt-4 text-sm text-green-600">
                            ✅ Notification system is integrated and ready!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
