import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HouseholdExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    description: "",
    date: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editExpense, setEditExpense] = useState({
    category: "",
    amount: "",
    description: "",
    date: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchExpenses(token);
  }, [navigate]);

  const fetchExpenses = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/expenses/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching expenses. Please login again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleAddChange = (e) => {
    setNewExpense((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditChange = (e) => {
    setEditExpense((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/expenses/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExpense),
      });
      if (!res.ok) throw new Error("Failed to add expense");
      const data = await res.json();
      setExpenses((prev) => [data.expense, ...prev]); // Add at top
      setNewExpense({ category: "", amount: "", description: "", date: "" });
      setShowAddForm(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (expense) => {
    setEditingId(expense._id);
    setEditExpense({
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
      date: expense.date ? expense.date.split("T")[0] : "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/expenses/update/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editExpense),
        }
      );
      if (!res.ok) throw new Error("Failed to update expense");
      const data = await res.json();
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === editingId ? data.expense : exp))
      );
      setEditingId(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this expense?")) return;
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/expenses/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete expense");
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
  <Header />
  <div className="container py-4" style={{ minHeight: "80vh" }}>
    <h2 className="mb-4 text-primary text-center">Household Expenses</h2>

    <div className="d-flex justify-content-end mb-3">
      <button
        className="btn btn-success"
        onClick={() => setShowAddForm((prev) => !prev)}
      >
        {showAddForm ? "Cancel" : "Add New Expense"}
      </button>
    </div>

    {showAddForm && (
      <form className="mb-4" onSubmit={handleAddSubmit}>
        <div className="row g-3">
          <div className="col-md-3 col-12">
            <select
              name="category"
              className="form-select"
              value={newExpense.category}
              onChange={handleAddChange}
              required
            >
              <option value="">-- Select Category --</option>
              <option value="Groceries">Groceries</option>
              <option value="Utilities">Utilities</option>
              <option value="Rent">Rent</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-md-2 col-6">
            <input
              type="number"
              name="amount"
              className="form-control"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={handleAddChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="col-md-4 col-6">
            <input
              type="text"
              name="description"
              className="form-control"
              placeholder="Description"
              value={newExpense.description}
              onChange={handleAddChange}
            />
          </div>
          <div className="col-md-3 col-12">
            <input
              type="date"
              name="date"
              className="form-control"
              value={newExpense.date}
              onChange={handleAddChange}
              required
            />
          </div>
        </div>
        <div className="mt-3 text-end">
          <button type="submit" className="btn btn-primary">
            Add Expense
          </button>
        </div>
      </form>
    )}

    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search by description or category"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    {expenses.length === 0 ? (
      <p className="text-center text-muted">No expenses recorded yet.</p>
    ) : (
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses
              .filter(
                (expense) =>
                  expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  expense.category.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((expense) =>
                editingId === expense._id ? (
                  <tr key={expense._id}>
                    <td>
                      <select
                        name="category"
                        className="form-select"
                        value={editExpense.category}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="">-- Select Category --</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Rent">Rent</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Other">Other</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        name="amount"
                        value={editExpense.amount}
                        onChange={handleEditChange}
                        className="form-control"
                        required
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="description"
                        value={editExpense.description}
                        onChange={handleEditChange}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="date"
                        value={editExpense.date}
                        onChange={handleEditChange}
                        className="form-control"
                        required
                      />
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-sm btn-success me-2"
                        onClick={handleEditSubmit}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={expense._id}>
                    <td>{expense.category}</td>
                    <td>₹{parseFloat(expense.amount).toFixed(2)}</td>
                    <td>{expense.description}</td>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEditClick(expense)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(expense._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
    )}
  </div>
  <Footer />
</>

  );
}
