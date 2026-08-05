import React from 'react';
import Card from '../Card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const MONOCHROME_COLORS = ['#FFFFFF', '#A1A1AA', '#71717A', '#52525B', '#3F3F46', '#27272A'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111111] border border-[#2A2A2A] p-2.5 rounded-xl shadow-xl text-xs text-white">
        <p className="font-semibold mb-1 text-[#A1A1AA]">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || '#FFF' }} />
            <span>{entry.name}:</span>
            <span className="font-bold text-white">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const AnalyticsCharts = ({ charts = {} }) => {
  const monthlyBorrowTrend = charts.monthlyBorrowTrend || [];
  const booksAddedTrend = charts.booksAddedTrend || [];
  const categoryDistribution = charts.categoryDistribution || [];

  const hasCategoryData = categoryDistribution.length > 0 && categoryDistribution.some((c) => c.value > 0);

  return (
    <div className="space-y-6 mb-6">
      {/* Top Row: Monthly Borrow Trend & Books Added Per Month */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Monthly Borrow Trend (Line Chart) */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Borrow Trend</h3>
              <p className="text-xs text-[#A1A1AA]">Realtime book loan volume by month</p>
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {monthlyBorrowTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyBorrowTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717A" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="borrows"
                    name="Loans"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    dot={{ fill: '#FFFFFF', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-[#A1A1AA]">No Data Available</span>
            )}
          </div>
        </Card>

        {/* 2. Books Added Per Month (Bar Chart) */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Books Added Per Month</h3>
              <p className="text-xs text-[#A1A1AA]">Realtime catalog growth tracking</p>
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {booksAddedTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={booksAddedTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717A" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="added" name="Books Added" fill="#A1A1AA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-[#A1A1AA]">No Data Available</span>
            )}
          </div>
        </Card>
      </div>

      {/* Middle Row: Category Distribution (Pie Chart) */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Category Analytics</h3>
              <p className="text-xs text-[#A1A1AA]">Book catalog breakdown across categories</p>
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {hasCategoryData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MONOCHROME_COLORS[index % MONOCHROME_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#A1A1AA' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-[#A1A1AA]">No Data Available</span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
