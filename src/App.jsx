
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Search,
  MoreHorizontal,
  ArrowUpRight,
  UserPlus,
  CreditCard,
  ShoppingBag,
  FileText,
  Clock,
  Download,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import RevenueChart from "./components/RevenueChart";

import {
  stats,
  transactions as initialTransactions,
  activities,
} from "./data/dashboardData";

import "./App.css";

const activityIcons = {
  UserPlus,
  CreditCard,
  ShoppingBag,
  FileText,
};

const emptyForm = {
  customer: "",
  email: "",
  product: "Premium Plan",
  date: new Date().toISOString().slice(0, 10),
  amount: "",
  status: "Pending",
};

function App() {
  const [active, setActive] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(true);
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("adminpro_transactions");
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "adminpro_transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch =
      item.customer.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  }

  function openEditModal(item) {
    setEditingId(item.id);
    setForm({
      customer: item.customer,
      email: item.email,
      product: item.product,
      date: item.dateISO || new Date(item.date).toISOString().slice(0, 10),
      amount: String(
        Number(item.amount.replace(/[^0-9.]/g, ""))
      ),
      status: item.status,
    });
    setFormError("");
    setShowModal(true);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.customer.trim() ||
      !form.email.trim() ||
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      setFormError("Lengkapi semua data dengan benar.");
      return;
    }

    const formattedDate = new Date(
      `${form.date}T00:00:00`
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    const transactionData = {
      id: editingId || `TRX-${Date.now()}`,
      customer: form.customer.trim(),
      email: form.email.trim(),
      product: form.product,
      date: formattedDate,
      dateISO: form.date,
      amount: `$${Number(form.amount).toFixed(2)}`,
      status: form.status,
    };

    if (editingId) {
      setTransactions((prev) =>
        prev.map((item) =>
          item.id === editingId ? transactionData : item
        )
      );
    } else {
      setTransactions((prev) => [
        transactionData,
        ...prev,
      ]);
    }

    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus transaksi ini?"
    );

    if (!confirmed) return;

    setTransactions((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

// EXPORT EXCEL

function handleExportExcel() {
  const data = filteredTransactions.map((item) => ({
    "Transaction ID": item.id,
    Customer: item.customer,
    Email: item.email,
    Product: item.product,
    Date: item.date,
    Amount: item.amount,
    Status: item.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet["!cols"] = [
    { wch: 20 },
    { wch: 25 },
    { wch: 30 },
    { wch: 20 },
    { wch: 18 },
    { wch: 15 },
    { wch: 15 },
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Transactions"
  );

  XLSX.writeFile(
    workbook,
    "AdminPro-Transactions.xlsx"
  );
}

// EXPORT PDF

function handleExportPDF() {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  doc.setFontSize(20);
  doc.setTextColor(40, 80, 160);
  doc.text("AdminPro - Transaction Report", 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Generated: ${new Date().toLocaleDateString("id-ID")}`,
    14,
    26
  );

  doc.text(
    `Total Transactions: ${filteredTransactions.length}`,
    14,
    32
  );

  autoTable(doc, {
    startY: 40,
    head: [[
      "Transaction ID",
      "Customer",
      "Email",
      "Product",
      "Date",
      "Amount",
      "Status",
    ]],

    body: filteredTransactions.map((item) => [
      item.id,
      item.customer,
      item.email,
      item.product,
      item.date,
      item.amount,
      item.status,
    ]),

    theme: "grid",

    headStyles: {
      fillColor: [53, 105, 233],
      textColor: 255,
      fontStyle: "bold",
    },

    styles: {
      fontSize: 9,
      cellPadding: 4,
    },

    alternateRowStyles: {
      fillColor: [242, 246, 252],
    },
  });

  doc.save("AdminPro-Transactions.pdf");
}


  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <Sidebar
        active={active}
        setActive={setActive}
        open={open}
        setOpen={setOpen}
      />

      <main className="main-content">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setOpen={setOpen}
        />

        <div className="dashboard-content">

          <section className="welcome-section">
            <div>
              <h1>{active}</h1>
              <p>
                Welcome back! Here's what's happening
                with your business today.
              </p>
            </div>

      
<div className="export-buttons">
  <button
    className="export-excel"
    onClick={handleExportExcel}
  >
    <Download size={16} />
    Export Excel
  </button>

  <button
    className="export-pdf"
    onClick={handleExportPDF}
  >
    <FileText size={16} />
    Export PDF
  </button>
</div>

          </section>

          <section className="stats-grid">
            {stats.map((item) => (
              <StatCard key={item.title} item={item} />
            ))}
          </section>

          <section className="analytics-grid">
            <RevenueChart />

            <div className="activity-card">
              <div className="section-heading">
                <div>
                  <h3>Recent Activity</h3>
                  <p>Latest business updates</p>
                </div>

                <button className="more-button">
                  <MoreHorizontal size={21} />
                </button>
              </div>

              <div className="activity-list">
                {activities.map((item, index) => {
                  const Icon = activityIcons[item.icon];

                  return (
                    <div className="activity-item" key={index}>
                      <div className="activity-icon">
                        <Icon size={18} />
                      </div>

                      <div className="activity-info">
                        <strong>{item.title}</strong>
                        <p>{item.description}</p>
                        <small>
                          <Clock size={12} />
                          {item.time}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="view-all">
                View all activity
                <ArrowUpRight size={15} />
              </button>
            </div>
          </section>

          <section className="transactions-card">
            <div className="section-heading transaction-heading">
              <div>
                <h3>Recent Transactions</h3>
                <p>
                  Manage your customer transactions
                </p>
              </div>

              <button
                className="secondary-button"
                onClick={openAddModal}
              >
                <Plus size={17} />
                Add Transaction
              </button>
            </div>

            <div className="table-toolbar">
              <div className="table-search">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customer or ID..."
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((item) => (
                    <tr key={item.id}>
                      <td className="transaction-id">
                        {item.id}
                      </td>

                      <td>
                        <div className="customer-info">
                          <div className="customer-avatar">
                            {item.customer.charAt(0)}
                          </div>

                          <div>
                            <strong>{item.customer}</strong>
                            <small>{item.email}</small>
                          </div>
                        </div>
                      </td>

                      <td>{item.product}</td>
                      <td>{item.date}</td>
                      <td className="amount">{item.amount}</td>

                      <td>
                        <span
                          className={`status ${item.status.toLowerCase()}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-edit"
                            onClick={() => openEditModal(item)}
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            className="action-delete"
                            onClick={() => handleDelete(item.id)}
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              Showing {filteredTransactions.length} of{" "}
              {transactions.length} transactions

              <button
                className="view-all"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
              >
                Clear filters
              </button>
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>© 2026 AdminPro Dashboard</span>
            <span>Built with React & Vite</span>
          </footer>
        </div>
      </main>

      {/* ADD / EDIT MODAL */}

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="transaction-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingId ? "Edit Transaction" : "Add Transaction"}
                </h2>
                <p>Enter transaction information below.</p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Customer Name</label>
                  <input
                    value={form.customer}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        customer: e.target.value,
                      })
                    }
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    placeholder="customer@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Product</label>
                  <select
                    value={form.product}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        product: e.target.value,
                      })
                    }
                  >
                    <option>Basic Plan</option>
                    <option>Premium Plan</option>
                    <option>Enterprise Plan</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount ($)</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        amount: e.target.value,
                      })
                    }
                    placeholder="250.00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        date: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value,
                      })
                    }
                  >
                    <option>Pending</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>

              {formError && (
                <p className="form-error">{formError}</p>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingId ? "Save Changes" : "Create Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
