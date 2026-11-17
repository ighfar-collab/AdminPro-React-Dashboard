
import {
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
  TrendingUp,
} from "lucide-react";

const icons = {
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
};

export default function StatCard({ item }) {
  const Icon = icons[item.icon];

  return (
    <div className="stat-card">
      <div className="stat-top">
        <div>
          <p>{item.title}</p>
          <h2>{item.value}</h2>
        </div>

        <div className={`stat-icon ${item.color}`}>
          <Icon size={22} />
        </div>
      </div>

      <div className="stat-footer">
        <span className="stat-change">
          <TrendingUp size={14} />
          {item.change}
        </span>

        <span>vs last month</span>
      </div>
    </div>
  );
}
