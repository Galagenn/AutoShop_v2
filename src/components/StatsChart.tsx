"use client";
import { ResponsiveContainer, LineChart, Line, Tooltip, CartesianGrid, XAxis, YAxis } from "recharts";

type Point = { label: string; value: number };

export default function StatsChart({ data }: { data: Point[] }) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f] p-4 h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" />
          <XAxis dataKey="label" stroke="#6b7280" tickLine={false} axisLine={{ stroke: "#2a2a2a" }} />
          <YAxis stroke="#6b7280" tickLine={false} axisLine={{ stroke: "#2a2a2a" }} />
          <Tooltip contentStyle={{ background: "#0f0f0f", border: "1px solid #2a2a2a", color: "#fff" }} />
          <Line type="monotone" dataKey="value" stroke="#C8BF2F" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


