import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function EducationFees() {
  const [fees, setFees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFee, setNewFee] = useState({
    childName: "",
    classLevel: "",
    month: "",
    amount: "",
    notes: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFee, setEditFee] = useState({
    childName: "",
    classLevel: "",
    month: "",
    amount: "",
    notes: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchFees(token);
  }, [navigate]);

  const fetchFees = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/education/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFees(data);
    } catch (err) {
      alert("Error loading fees. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleAddChange = (e) => {
    setNewFee((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditChange = (e) => {
    setEditFee((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/education/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newFee),
      });
      const data = await res.json();
      setFees((prev) => [data.fee, ...prev]);
      setNewFee({
        childName: "",
        classLevel: "",
        month: "",
        amount: "",
        notes: "",
      });
      setShowAddForm(false);
    } catch (err) {
      alert("Failed to add fee");
    }
  };

  const handleEditClick = (fee) => {
    setEditingId(fee._id);
    setEditFee({
      childName: fee.childName,
      classLevel: fee.classLevel,
      month: fee.month,
      amount: fee.amount,
      notes: fee.notes,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
       `${import.meta.env.VITE_API_BASE_URL}/education/update/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFee),
        }
      );
      const data = await res.json();
      setFees((prev) =>
        prev.map((f) => (f._id === editingId ? data.fee : f))
      );
      setEditingId(null);
    } catch (err) {
      alert("Failed to update fee");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this fee record?")) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/education/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFees((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <>
      <Header />
<div className="container py-4" style={{ minHeight: "80vh" }}>
  <h2 className="mb-4 text-primary text-center">Education Fees</h2>

  <div className="d-flex justify-content-end mb-3">
    <button
      className="btn btn-success"
      onClick={() => setShowAddForm((prev) => !prev)}
    >
      {showAddForm ? "Cancel" : "Add New Fee"}
    </button>
  </div>

  {showAddForm && (
    <form className="mb-4" onSubmit={handleAddSubmit}>
      <div className="row g-3">
        <div className="col-md-3 col-12">
          <input
            type="text"
            name="childName"
            className="form-control"
            placeholder="Child's Name"
            value={newFee.childName}
            onChange={handleAddChange}
            required
          />
        </div>
        <div className="col-md-2 col-6">
          <input
            type="text"
            name="classLevel"
            className="form-control"
            placeholder="Class"
            value={newFee.classLevel}
            onChange={handleAddChange}
            required
          />
        </div>
        <div className="col-md-2 col-6">
          <select
            name="month"
            className="form-select"
            value={newFee.month}
            onChange={handleAddChange}
            required
          >
            <option value="">Select Month</option>
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2 col-6">
          <input
            type="number"
            name="amount"
            className="form-control"
            placeholder="Amount"
            value={newFee.amount}
            onChange={handleAddChange}
            required
          />
        </div>
        <div className="col-md-3 col-6">
          <input
            type="text"
            name="notes"
            className="form-control"
            placeholder="Notes"
            value={newFee.notes}
            onChange={handleAddChange}
          />
        </div>
      </div>
      <div className="mt-3 text-end">
        <button type="submit" className="btn btn-primary">
          Add Fee
        </button>
      </div>
    </form>
  )}

  <div className="mb-3">
    <input
      type="text"
      className="form-control"
      placeholder="Search by student name"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  {fees.length === 0 ? (
    <p className="text-center text-muted">No education fee records yet.</p>
  ) : (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Child</th>
            <th>Class</th>
            <th>Month</th>
            <th>Amount</th>
            <th>Notes</th>
            <th>Date Paid</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fees
            .filter((fee) =>
              fee.childName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((fee) =>
              editingId === fee._id ? (
                <tr key={fee._id}>
                  <td>
                    <input
                      type="text"
                      name="childName"
                      value={editFee.childName}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="classLevel"
                      value={editFee.classLevel}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <select
                      name="month"
                      value={editFee.month}
                      onChange={handleEditChange}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      {monthOptions.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      name="amount"
                      value={editFee.amount}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="notes"
                      value={editFee.notes}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>{new Date(fee.datePaid).toLocaleDateString()}</td>
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
                <tr key={fee._id}>
                  <td>{fee.childName}</td>
                  <td>{fee.classLevel}</td>
                  <td>{fee.month}</td>
                  <td>₹{parseFloat(fee.amount).toFixed(2)}</td>
                  <td>{fee.notes}</td>
                  <td>{new Date(fee.datePaid).toLocaleDateString()}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEditClick(fee)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(fee._id)}
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
