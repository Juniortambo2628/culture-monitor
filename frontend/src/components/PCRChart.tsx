"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface PCRChartProps {
  data: {
    segment: string;
    reading: number;
  }[];
}

export default function PCRChart({ data }: PCRChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="99%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="segment" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontWeight: 600, fontSize: 11 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontWeight: 600, fontSize: 11 }}
            domain={[0, 10]}
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="reading" name="PCR™ Reading" fill="#2d5a5a" radius={[4, 4, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
