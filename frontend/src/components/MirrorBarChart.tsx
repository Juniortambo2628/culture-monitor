"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

interface MirrorBarChartProps {
  data: {
    label: string;
    groupA: number;
    groupB: number;
  }[];
}

export default function MirrorBarChart({ data }: MirrorBarChartProps) {
  // Transform data for mirroring: groupA as negative values for the left side
  const transformedData = data.map(item => ({
    ...item,
    groupANeg: -item.groupA
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="99%" height="100%">
        <BarChart
          layout="vertical"
          data={transformedData}
          margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
          stackOffset="sign"
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="label" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontWeight: 600, fontSize: 12 }} 
            width={100} 
            orientation="left"
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => Math.abs(Number(value))}
          />
          <Bar dataKey="groupANeg" fill="#3b82f6" stackId="stack" radius={[4, 0, 0, 4]} barSize={20}>
             {transformedData.map((entry, index) => (
                <Cell key={`cell-left-${index}`} fill="#3b82f6" />
             ))}
          </Bar>
          <Bar dataKey="groupB" fill="#f59e0b" stackId="stack" radius={[0, 4, 4, 0]} barSize={20}>
             {transformedData.map((entry, index) => (
                <Cell key={`cell-right-${index}`} fill="#f59e0b" />
             ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
