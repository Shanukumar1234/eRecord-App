import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LabourCost() {
  const [labourCosts, setLabourCosts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabourCost, setNewLabourCost] = useState({
    labourName: "",
    itemName: "",
    costAmount: "",
    date: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editLabourCost, setEditLabourCost] = useState({
    labourName: "",
    itemName: "",
    costAmount: "",
    date: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchLabourCosts(token);
  }, [navigate]);

  const fetchLabourCosts = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/labourcost/my`, {
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
      setLabourCosts(data);
    } catch (error) {
      alert("Error loading labour costs. Please login again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleAddChange = (e) => {
    setNewLabourCost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditChange = (e) => {
    setEditLabourCost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/labourcost/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLabourCost),
      });
      if (!res.ok) throw new Error("Failed to add labour cost");
      const data = await res.json();
      setLabourCosts((prev) => [data.labourCost, ...prev]);
      setNewLabourCost({ labourName: "", itemName: "", costAmount: "", date: "" });
      setShowAddForm(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (labourCost) => {
    setEditingId(labourCost._id);
    setEditLabourCost({
      labourName: labourCost.labourName,
      itemName: labourCost.itemName,
      costAmount: labourCost.costAmount,
      date: labourCost.date ? labourCost.date.split("T")[0] : "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/labourcost/update/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editLabourCost),
        }
      );
      if (!res.ok) throw new Error("Failed to update labour cost");
      const data = await res.json();
      setLabourCosts((prev) =>
        prev.map((lc) => (lc._id === editingId ? data.labourCost : lc))
      );
      setEditingId(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this labour cost record?")) return;
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/labourcost/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete labour cost");
      setLabourCosts((prev) => prev.filter((lc) => lc._id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredLabourCosts = labourCosts.filter((lc) =>
    lc.labourName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="container py-4" style={{ minHeight: "80vh" }}>
        <h2 className="mb-4 text-primary text-center">Labour Costs</h2>

        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-success"
            onClick={() => setShowAddForm((prev) => !prev)}
          >
            {showAddForm ? "Cancel" : "Add New Labour Cost"}
          </button>
        </div>

        {showAddForm && (
          <form className="mb-4" onSubmit={handleAddSubmit}>
            <div className="row g-3">
              <div className="col-md-6 col-lg-3">
                <input
                  type="text"
                  name="labourName"
                  className="form-control"
                  placeholder="Labour Name"
                  value={newLabourCost.labourName}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-md-6 col-lg-3">
                <input
                  type="text"
                  name="itemName"
                  className="form-control"
                  placeholder="Work Done"
                  value={newLabourCost.itemName}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-md-6 col-lg-2">
                <input
                  type="number"
                  name="costAmount"
                  className="form-control"
                  placeholder="Amount Paid"
                  value={newLabourCost.costAmount}
                  onChange={handleAddChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="col-md-6 col-lg-2">
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={newLabourCost.date}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-12 col-lg-2 text-end">
                <button type="submit" className="btn btn-primary w-100">
                  Add
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by labour name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredLabourCosts.length === 0 ? (
          <p className="text-center text-muted">No labour cost records found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Labour Name</th>
                  <th>Work Done</th>
                  <th>Amount Paid</th>
                  <th>Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLabourCosts.map((lc) =>
                  editingId === lc._id ? (
                    <tr key={lc._id}>
                      <td>
                        <input
                          type="text"
                          name="labourName"
                          value={editLabourCost.labourName}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="itemName"
                          value={editLabourCost.itemName}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="costAmount"
                          value={editLabourCost.costAmount}
                          onChange={handleEditChange}
                          className="form-control"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          name="date"
                          value={editLabourCost.date}
                          onChange={handleEditChange}
                          className="form-control"
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
                    <tr key={lc._id}>
                      <td>{lc.labourName}</td>
                      <td>{lc.itemName}</td>
                      <td>₹{parseFloat(lc.costAmount).toFixed(2)}</td>
                      <td>{new Date(lc.date).toLocaleDateString()}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEditClick(lc)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(lc._id)}
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
