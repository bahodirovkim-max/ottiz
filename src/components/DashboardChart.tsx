'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function DashboardChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" strokeOpacity={0.2} />
          <XAxis 
             dataKey="month" 
             axisLine={false} 
             tickLine={false} 
             tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 700 }}
             dy={10}
          />
          <YAxis 
             axisLine={false} 
             tickLine={false} 
             tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 700 }}
             tickFormatter={(value) => `${value / 1000000}M`}
          />
          <Tooltip 
             cursor={{ fill: 'transparent' }}
             contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
             formatter={(value: any) => [`${(value || 0).toLocaleString()} UZS`, "Tushum"]}
             labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
          />
          <Bar dataKey="total" radius={[8, 8, 8, 8]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#2AABEE' : '#3f3f46'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
