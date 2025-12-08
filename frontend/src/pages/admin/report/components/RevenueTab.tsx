import React from 'react';
import type { ReportPeriod, RevenueData } from '../../../../types/Report';
import DateRangePicker from '../../../../components/report/DateRangePicker';
import FilterBar from '../../../../components/report/FilterBar';
import ExportButton from '../../../../components/report/ExportButton';
import RevenueSummary from '../../../../components/report/RevenueSummary';
import RevenueChart from '../../../../components/report/RevenueChart';

type Props = {
    startDate: string;
    endDate: string;
    period: ReportPeriod;
    onStartDateChange: (d: string) => void;
    onEndDateChange: (d: string) => void;
    onPeriodChange: (p: ReportPeriod) => void;
    activeTab: 'revenue';
    revenueData: RevenueData[];
    revenueLoading: boolean;
    revenueError: string | null;
};

const RevenueTab: React.FC<Props> = ({
    startDate,
    endDate,
    period,
    onStartDateChange,
    onEndDateChange,
    onPeriodChange,
    activeTab,
    revenueData,
    revenueLoading,
    revenueError,
}) => {
    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-[#EBE3D7] mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={onStartDateChange}
                        onEndDateChange={onEndDateChange}
                    />
                    <div className="flex gap-4 items-center">
                        <FilterBar
                            period={period}
                            onPeriodChange={onPeriodChange}
                        />
                        <ExportButton
                            reportType={activeTab}
                            dateRange={{ startDate, endDate }}
                        />
                    </div>
                </div>
            </div>

            {/* Optional: small status banner */}
            {revenueLoading && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded">
                    Loading revenue data...
                </div>
            )}
            {revenueError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
                    {revenueError}
                </div>
            )}

            <RevenueSummary data={revenueData} />

            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Revenue Trends</h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm border border-[#EBE3D7] rounded hover:bg-[#F5F0EB]">
                            Line
                        </button>
                        <button className="px-3 py-1 text-sm border border-[#EBE3D7] rounded hover:bg-[#F5F0EB]">
                            Bar
                        </button>
                        <button className="px-3 py-1 text-sm bg-[#CCBDA3] text-white rounded">
                            Area
                        </button>
                    </div>
                </div>
                <RevenueChart data={revenueData} chartType="area" />
            </div>
        </div>
    );
};

export default RevenueTab;
