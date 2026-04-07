"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, CartesianGrid } from "recharts";

interface SideBySideBarChartProps {
  data: {
    label: string;
    poll1: number;
    poll2: number;
  }[];
}

export default function SideBySideBarChart({ data }: SideBySideBarChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="99%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontWeight: 600, fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontWeight: 600, fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 600, fontSize: '12px' }} />
          <Bar dataKey="poll1" name="Poll 1" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={24} />
          <Bar dataKey="poll2" name="Poll 2" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
