import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import Card, { CardTitle, CardDescription } from '../Card';
import Badge from '../Badge';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#171717] border border-[#2A2A2A] p-3 rounded-xl shadow-xl text-xs text-white">
        <p className="font-semibold mb-1 text-[#A1A1AA]">{label}</p>
        <p className="text-white font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white inline-block" />
          Added: <span className="font-bold">{payload[0].value} books</span>
        </p>
      </div>
    );
  }
  return null;
};

export const InventoryChart = ({ data = [] }) => {
  // If data is empty, generate sample 30-day baseline data for graceful display
  const chartData = data.length > 0 ? data : Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      books: Math.floor(Math.random() * 5) + 1,
    };
  });

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-[#2A2A2A] mb-6">
        <div>
          <CardTitle className="text-lg">Inventory Analytics</CardTitle>
          <CardDescription>Books added over the last 30 days</CardDescription>
        </div>
        <Badge variant="neutral">Realtime Sync</Badge>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#A1A1AA" 
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: '#2A2A2A' }} 
            />
            <YAxis 
              stroke="#A1A1AA" 
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: '#2A2A2A' }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="books"
              stroke="#FFFFFF"
              strokeWidth={2}
              dot={{ fill: '#FFFFFF', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#FFFFFF', stroke: '#0B0B0B', strokeWidth: 2 }}
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default InventoryChart;
