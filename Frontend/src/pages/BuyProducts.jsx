import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function BuyProducts() {
  const [records, setRecords] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    farmerName: "",
    dateOfBuy: "",
    paymentMethod: "cash",
    chequeNumber: "",
    items: [{ itemName: "", amount: "", weight: "" }],
    totalAmount: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editRecord, setEditRecord] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchRecords(token);
  }, [navigate]);

  const fetchRecords = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/buyproduct/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      const data = await res.json();
      setRecords(data);
    } catch (error) {
      alert("Error fetching buy products. Please login again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Handlers for add form
  const handleNewRecordChange = (e) => {
    setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
  };

  const handleNewItemChange = (index, e) => {
    const updatedItems = [...newRecord.items];
    updatedItems[index][e.target.name] = e.target.value;
    setNewRecord({ ...newRecord, items: updatedItems });
    calculateTotalAmount(updatedItems);
  };

  const addNewItemField = () => {
    setNewRecord({
      ...newRecord,
      items: [...newRecord.items, { itemName: "", amount: "", weight: "" }],
    });
  };

  const removeItemField = (index) => {
    const updatedItems = newRecord.items.filter((_, i) => i !== index);
    setNewRecord({ ...newRecord, items: updatedItems });
    calculateTotalAmount(updatedItems);
  };

  const calculateTotalAmount = (items) => {
    const total = items.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);
    setNewRecord((prev) => ({ ...prev, totalAmount: total }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    if (newRecord.paymentMethod === "cheque" && !newRecord.chequeNumber) {
      alert("Please provide cheque number for cheque payment.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/buyproduct/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newRecord),
      });
      if (!res.ok) throw new Error("Failed to add buy product record");
      const data = await res.json();
      setRecords((prev) => [data.buyProduct, ...prev]);
      setNewRecord({
        farmerName: "",
        dateOfBuy: "",
        paymentMethod: "cash",
        chequeNumber: "",
        items: [{ itemName: "", amount: "", weight: "" }],
        totalAmount: 0,
      });
      setShowAddForm(false);
    } catch (error) {
      alert(error.message);
    }
  };

  // Handlers for edit form
  const handleEditClick = (record) => {
    setEditingId(record._id);
    const editItems = record.items.map((item) => ({
      itemName: item.itemName,
      amount: item.amount.toString(),
      weight: item.weight ? item.weight.toString() : "",
    }));

    setEditRecord({
      farmerName: record.farmerName,
      dateOfBuy: record.dateOfBuy ? record.dateOfBuy.split("T")[0] : "",
      paymentMethod: record.paymentMethod,
      chequeNumber: record.chequeNumber || "",
      items: editItems,
      totalAmount: record.totalAmount,
    });
  };

  const handleEditChange = (e) => {
    setEditRecord({ ...editRecord, [e.target.name]: e.target.value });
  };

  const handleEditItemChange = (index, e) => {
    const updatedItems = [...editRecord.items];
    updatedItems[index][e.target.name] = e.target.value;
    setEditRecord({ ...editRecord, items: updatedItems });
    calculateTotalAmountEdit(updatedItems);
  };

  const addEditItemField = () => {
    setEditRecord({
      ...editRecord,
      items: [...editRecord.items, { itemName: "", amount: "", weight: "" }],
    });
  };

  const removeEditItemField = (index) => {
    const updatedItems = editRecord.items.filter((_, i) => i !== index);
    setEditRecord({ ...editRecord, items: updatedItems });
    calculateTotalAmountEdit(updatedItems);
  };

  const calculateTotalAmountEdit = (items) => {
    const total = items.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);
    setEditRecord((prev) => ({ ...prev, totalAmount: total }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    if (editRecord.paymentMethod === "cheque" && !editRecord.chequeNumber) {
      alert("Please provide cheque number for cheque payment.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/buyproduct/update/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editRecord),
      });
      if (!res.ok) throw new Error("Failed to update record");
      const data = await res.json();
      setRecords((prev) =>
        prev.map((rec) => (rec._id === editingId ? data.record : rec))
      );
      setEditingId(null);
      setEditRecord(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this record?")) return;
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/buyproduct/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete record");
      setRecords((prev) => prev.filter((rec) => rec._id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="container py-4" style={{ minHeight: "80vh" }}>
        <h2 className="mb-4 text-primary text-center">Buy Products</h2>

        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-success"
            onClick={() => setShowAddForm((prev) => !prev)}
          >
            {showAddForm ? "Cancel" : "Add New Record"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="mb-4">
            <div className="mb-3">
              <input
                type="text"
                name="farmerName"
                placeholder="Farmer Name"
                className="form-control"
                value={newRecord.farmerName}
                onChange={handleNewRecordChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="date"
                name="dateOfBuy"
                className="form-control"
                value={newRecord.dateOfBuy}
                onChange={handleNewRecordChange}
                required
              />
            </div>

            <div className="mb-3">
              <select
                name="paymentMethod"
                value={newRecord.paymentMethod}
                onChange={handleNewRecordChange}
                className="form-select"
                required
              >
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            {newRecord.paymentMethod === "cheque" && (
              <div className="mb-3">
                <input
                  type="text"
                  name="chequeNumber"
                  placeholder="Cheque Number"
                  className="form-control"
                  value={newRecord.chequeNumber}
                  onChange={handleNewRecordChange}
                  required
                />
              </div>
            )}

            <h5>Items</h5>
            {newRecord.items.map((item, index) => (
              <div key={index} className="row g-2 align-items-center mb-2">
                <div className="col-md-4">
                  <input
                    type="text"
                    name="itemName"
                    placeholder="Item Name"
                    className="form-control"
                    value={item.itemName}
                    onChange={(e) => handleNewItemChange(index, e)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    className="form-control"
                    value={item.amount}
                    onChange={(e) => handleNewItemChange(index, e)}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    name="weight"
                    placeholder="Weight (optional)"
                    className="form-control"
                    value={item.weight}
                    onChange={(e) => handleNewItemChange(index, e)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-md-2">
                  {newRecord.items.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeItemField(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={addNewItemField}
            >
              Add Item
            </button>

            <div className="mb-3">
              <strong>Total Amount: ₹{parseFloat(newRecord.totalAmount).toFixed(2)}</strong>
            </div>

            <button type="submit" className="btn btn-primary">
              Add Record
            </button>
          </form>
        )}

        {/* Edit form */}
        {editingId && editRecord && (
          <form onSubmit={handleEditSubmit} className="mb-4">
            <div className="mb-3">
              <input
                type="text"
                name="farmerName"
                placeholder="Farmer Name"
                className="form-control"
                value={editRecord.farmerName}
                onChange={handleEditChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="date"
                name="dateOfBuy"
                className="form-control"
                value={editRecord.dateOfBuy}
                onChange={handleEditChange}
                required
              />
            </div>

            <div className="mb-3">
              <select
                name="paymentMethod"
                value={editRecord.paymentMethod}
                onChange={handleEditChange}
                className="form-select"
                required
              >
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            {editRecord.paymentMethod === "cheque" && (
              <div className="mb-3">
                <input
                  type="text"
                  name="chequeNumber"
                  placeholder="Cheque Number"
                  className="form-control"
                  value={editRecord.chequeNumber}
                  onChange={handleEditChange}
                  required
                />
              </div>
            )}

            <h5>Items</h5>
            {editRecord.items.map((item, index) => (
              <div key={index} className="row g-2 align-items-center mb-2">
                <div className="col-md-4">
                  <input
                    type="text"
                    name="itemName"
                    placeholder="Item Name"
                    className="form-control"
                    value={item.itemName}
                    onChange={(e) => handleEditItemChange(index, e)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    className="form-control"
                    value={item.amount}
                    onChange={(e) => handleEditItemChange(index, e)}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    name="weight"
                    placeholder="Weight (optional)"
                    className="form-control"
                    value={item.weight}
                    onChange={(e) => handleEditItemChange(index, e)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-md-2">
                  {editRecord.items.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeEditItemField(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={addEditItemField}
            >
              Add Item
            </button>

            <div className="mb-3">
              <strong>Total Amount: ₹{parseFloat(editRecord.totalAmount).toFixed(2)}</strong>
            </div>

            <button type="submit" className="btn btn-success me-2">
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditingId(null);
                setEditRecord(null);
              }}
            >
              Cancel
            </button>
          </form>
        )}

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by farmer name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Records Table */}
        {records.length === 0 ? (
          <p className="text-center text-muted">No buy product records yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Farmer Name</th>
                  <th>Date of Buy</th>
                  <th>Payment Method</th>
                  <th>Cheque Number</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records
                  .filter((rec) =>
                    rec.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((rec) => (
                    <tr key={rec._id}>
                      <td>{rec.farmerName}</td>
                      <td>{new Date(rec.dateOfBuy).toLocaleDateString()}</td>
                      <td>{rec.paymentMethod}</td>
                      <td>{rec.paymentMethod === "cheque" ? rec.chequeNumber : "-"}</td>
                      <td>
                        <ul className="list-unstyled mb-0">
                          {rec.items.map((item, idx) => (
                            <li key={idx}>
                              {item.itemName} - ₹{parseFloat(item.amount).toFixed(2)}{" "}
                              {item.weight ? `(${item.weight} kg)` : ""}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>₹{parseFloat(rec.totalAmount).toFixed(2)}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEditClick(rec)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(rec._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

