"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";

export default function DashboardCharts({ chartData, topRows }: any) {
  return (
    <div className="mt-8 grid gap-8 md:grid-cols-2">
      <div>
        <h2 className="mb-3 font-bold">Clicks Over Time</h2>
        <div className="h-64 rounded-2xl border p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={11} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="clicks" stroke="#2f5ae0" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <h2 className="mb-3 font-bold">Most-Clicked Products</h2>
        <div className="h-64 rounded-2xl border p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topRows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={10} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="clicks" fill="#2f5ae0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
