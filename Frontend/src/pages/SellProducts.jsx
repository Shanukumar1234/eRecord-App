import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const paymentMethods = ["cash", "cheque"];

export default function SellProducts() {
  const [records, setRecords] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    buyerName: "",
    dateOfSale: "",
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
    if (!token) return navigate("/login");
    fetchRecords(token);
  }, [navigate]);

  const fetchRecords = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sellproduct/my`, {
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
      alert("Error fetching records. Please login again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Calculate total amount from items array
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  };
          const filteredRecords = records.filter((rec) =>
  rec.buyerName.toLowerCase().includes(searchTerm.toLowerCase())
);
  // Handle input change for Add form
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle items change in Add form
  const handleAddItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...newRecord.items];
    newItems[index][name] = value;
    setNewRecord((prev) => ({
      ...prev,
      items: newItems,
      totalAmount: calculateTotal(newItems),
    }));
  };

  // Add new empty item row in Add form
  const addItemRow = () => {
    setNewRecord((prev) => ({
      ...prev,
      items: [...prev.items, { itemName: "", amount: "", weight: "" }],
    }));
  };

  // Remove item row in Add form
  const removeItemRow = (index) => {
    const newItems = [...newRecord.items];
    newItems.splice(index, 1);
    setNewRecord((prev) => ({
      ...prev,
      items: newItems,
      totalAmount: calculateTotal(newItems),
    }));
  };

  // Submit Add form
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (newRecord.paymentMethod === "cheque" && !newRecord.chequeNumber.trim()) {
      alert("Cheque number is required for cheque payment.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sellproduct/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newRecord),
      });
      if (!res.ok) throw new Error("Failed to add record");
      const data = await res.json();
      setRecords((prev) => [data.sellProduct, ...prev]);
      setNewRecord({
        buyerName: "",
        dateOfSale: "",
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

  // Edit: initialize edit state
  const handleEditClick = (record) => {
    setEditingId(record._id);
    setEditRecord({
      buyerName: record.buyerName,
      dateOfSale: record.dateOfSale ? record.dateOfSale.split("T")[0] : "",
      paymentMethod: record.paymentMethod,
      chequeNumber: record.chequeNumber || "",
      items: record.items.map((i) => ({
        itemName: i.itemName,
        amount: i.amount,
        weight: i.weight || "",
      })),
      totalAmount: record.totalAmount,
    });
  };

  // Edit: handle input change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Edit: handle items change
  const handleEditItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...editRecord.items];
    newItems[index][name] = value;
    setEditRecord((prev) => ({
      ...prev,
      items: newItems,
      totalAmount: calculateTotal(newItems),
    }));
  };

  // Edit: add new item row
  const addEditItemRow = () => {
    setEditRecord((prev) => ({
      ...prev,
      items: [...prev.items, { itemName: "", amount: "", weight: "" }],
    }));
  };

  // Edit: remove item row
  const removeEditItemRow = (index) => {
    const newItems = [...editRecord.items];
    newItems.splice(index, 1);
    setEditRecord((prev) => ({
      ...prev,
      items: newItems,
      totalAmount: calculateTotal(newItems),
    }));
  };

  // Edit: submit update
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (editRecord.paymentMethod === "cheque" && !editRecord.chequeNumber.trim()) {
      alert("Cheque number is required for cheque payment.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sellproduct/update/${editingId}`, {
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

  // Delete record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sellproduct/delete/${id}`, {
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
        <h2 className="mb-4 text-primary text-center">Sell Products</h2>

        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-success"
            onClick={() => setShowAddForm((prev) => !prev)}
          >
            {showAddForm ? "Cancel" : "Add New Sale"}
          </button>
        </div>

        {/* Add New Sale Form */}
        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="mb-4">
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  name="buyerName"
                  className="form-control"
                  placeholder="Buyer Name"
                  value={newRecord.buyerName}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  name="dateOfSale"
                  className="form-control"
                  value={newRecord.dateOfSale}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <select
                  name="paymentMethod"
                  className="form-select"
                  value={newRecord.paymentMethod}
                  onChange={handleAddChange}
                  required
                >
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {newRecord.paymentMethod === "cheque" && (
                <div className="col-md-2">
                  <input
                    type="text"
                    name="chequeNumber"
                    className="form-control"
                    placeholder="Cheque Number"
                    value={newRecord.chequeNumber}
                    onChange={handleAddChange}
                    required
                  />
                </div>
              )}
            </div>

            <hr />

            <h5>Items</h5>
            {newRecord.items.map((item, idx) => (
              <div key={idx} className="row g-2 align-items-center mb-2">
                <div className="col-md-4">
                  <input
                    type="text"
                    name="itemName"
                    className="form-control"
                    placeholder="Item Name"
                    value={item.itemName}
                    onChange={(e) => handleAddItemChange(idx, e)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    name="amount"
                    className="form-control"
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                    value={item.amount}
                    onChange={(e) => handleAddItemChange(idx, e)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    name="weight"
                    className="form-control"
                    placeholder="Weight (optional)"
                    min="0"
                    step="0.01"
                    value={item.weight}
                    onChange={(e) => handleAddItemChange(idx, e)}
                  />
                </div>
                <div className="col-md-2">
                  {newRecord.items.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeItemRow(idx)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary btn-sm mb-3"
              onClick={addItemRow}
            >
              Add Item
            </button>

            <div className="text-end mb-3">
              <strong>Total Amount: ₹{newRecord.totalAmount.toFixed(2)}</strong>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-primary">
                Add Sale
              </button>
            </div>
          </form>
        )}
          <div className="mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="Search by Buyer Name"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  </div>
        {/* Records Table */}
        {records.length === 0 ? (
          <p className="text-center text-muted">No sell product records found.</p>
        ) : (
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Buyer Name</th>
                <th>Date of Sale</th>
                <th>Payment Method</th>
                <th>Cheque Number</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
   
              {filteredRecords.map((rec) =>
                editingId === rec._id ? (
                  <tr key={rec._id}>
                    <td>
                      <input
                        type="text"
                        name="buyerName"
                        value={editRecord.buyerName}
                        onChange={handleEditChange}
                        className="form-control"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="dateOfSale"
                        value={editRecord.dateOfSale}
                        onChange={handleEditChange}
                        className="form-control"
                        required
                      />
                    </td>
                    <td>
                      <select
                        name="paymentMethod"
                        value={editRecord.paymentMethod}
                        onChange={handleEditChange}
                        className="form-select"
                        required
                      >
                        {paymentMethods.map((method) => (
                          <option key={method} value={method}>
                            {method.charAt(0).toUpperCase() + method.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {editRecord.paymentMethod === "cheque" ? (
                        <input
                          type="text"
                          name="chequeNumber"
                          value={editRecord.chequeNumber}
                          onChange={handleEditChange}
                          className="form-control"
                          required
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {editRecord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="d-flex gap-2 mb-2"
                          style={{ flexWrap: "wrap" }}
                        >
                          <input
                            type="text"
                            name="itemName"
                            placeholder="Item Name"
                            value={item.itemName}
                            onChange={(e) => handleEditItemChange(idx, e)}
                            className="form-control"
                            required
                            style={{ minWidth: "120px" }}
                          />
                          <input
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={item.amount}
                            onChange={(e) => handleEditItemChange(idx, e)}
                            className="form-control"
                            min="0"
                            step="0.01"
                            required
                            style={{ maxWidth: "100px" }}
                          />
                          <input
                            type="number"
                            name="weight"
                            placeholder="Weight (optional)"
                            value={item.weight}
                            onChange={(e) => handleEditItemChange(idx, e)}
                            className="form-control"
                            min="0"
                            step="0.01"
                            style={{ maxWidth: "100px" }}
                          />
                          {editRecord.items.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removeEditItemRow(idx)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={addEditItemRow}
                      >
                        Add Item
                      </button>
                    </td>
                    <td>₹{editRecord.totalAmount.toFixed(2)}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={handleEditSubmit}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          setEditingId(null);
                          setEditRecord(null);
                        }}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={rec._id}>
                    <td>{rec.buyerName}</td>
                    <td>{new Date(rec.dateOfSale).toLocaleDateString()}</td>
                    <td>{rec.paymentMethod.charAt(0).toUpperCase() + rec.paymentMethod.slice(1)}</td>
                    <td>{rec.paymentMethod === "cheque" ? rec.chequeNumber : "-"}</td>
                    <td>
                      <ul className="mb-0">
                        {rec.items.map((item, idx) => (
                          <li key={idx}>
                            {item.itemName} — ₹{parseFloat(item.amount).toFixed(2)}
                            {item.weight ? `, Weight: ${item.weight}` : ""}
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
                )
              )}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
}

