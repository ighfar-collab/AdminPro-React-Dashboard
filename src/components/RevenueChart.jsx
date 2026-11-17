
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { revenueData } from "../data/dashboardData";

export default function RevenueChart() {
  return (
    <div className="chart-container">
      <div className="section-heading">
        <div>
          <h3>Revenue Overview</h3>
          <p>Revenue and expenses performance</p>
        </div>

        <select defaultValue="2026">
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
      </div>

      <div className="chart-legend">
        <span><i className="legend-revenue" /> Revenue</span>
        <span><i className="legend-expense" /> Expenses</span>
      </div>

      <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4778f5" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4778f5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#18b889" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#18b889" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#344054"
              opacity={0.3}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8993a7", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8993a7", fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />

            <Tooltip
              formatter={(value) => [
                `$${value.toLocaleString()}`,
                undefined,
              ]}
              contentStyle={{
                background: "#172033",
                border: "1px solid #344054",
                borderRadius: 10,
                color: "#fff",
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4778f5"
              strokeWidth={3}
              fill="url(#revenueFill)"
            />

            <Area
              type="monotone"
              dataKey="expense"
              stroke="#18b889"
              strokeWidth={3}
              fill="url(#expenseFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
