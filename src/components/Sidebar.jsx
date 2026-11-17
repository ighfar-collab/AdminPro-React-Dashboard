
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Customers", icon: Users },
  { label: "Orders", icon: ShoppingCart },
  { label: "Products", icon: Package },
  { label: "Analytics", icon: BarChart3 },
];

export default function Sidebar({
  active,
  setActive,
  open,
  setOpen,
}) {
  return (
    <>
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">A</div>
          <span>Admin<span className="brand-light">Pro</span></span>
          <button
            className="mobile-close"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="menu-label">MENU</div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`menu-item ${
                  active === item.label ? "active" : ""
                }`}
                onClick={() => {
                  setActive(item.label);
                  setOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="menu-label">GENERAL</div>

        <nav className="sidebar-menu">
          <button className="menu-item">
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button className="menu-item">
            <HelpCircle size={19} />
            <span>Help Center</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="avatar">IA</div>
            <div>
              <strong>Admin User</strong>
              <small>Administrator</small>
            </div>
          </div>

          <button className="logout-button">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
