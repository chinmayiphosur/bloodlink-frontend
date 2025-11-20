import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const BloodInventory = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState({
    "O+": 0,
    "O-": 0,
    "A+": 0,
    "A-": 0,
    "B+": 0,
    "B-": 0,
    "AB+": 0,
    "AB-": 0,
  });
  const [bloodLent, setBloodLent] = useState({
    "O+": 0,
    "O-": 0,
    "A+": 0,
    "A-": 0,
    "B+": 0,
    "B-": 0,
    "AB+": 0,
    "AB-": 0,
  });
  const [loading, setLoading] = useState(true);
  
  // For donation/lending forms
  const [donationForm, setDonationForm] = useState({ bloodGroup: "O+", units: 1 });
  const [lendingForm, setLendingForm] = useState({ 
    bloodGroup: "O+", 
    units: 1,
    receiverName: "",
    receiverAddress: "",
    receiverPhone: "",
    receiverEmail: "",
    notes: ""
  });
  const [lendingHistory, setLendingHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadInventory();
    loadLendingHistory();
  }, []);

  const loadInventory = async () => {
    try {
      const res = await api.get("/inventory/mine");
      if (res.data) {
        // Convert Map to object
        const stocksObj = {};
        const lentObj = {};
        
        Object.keys(stocks).forEach(bg => {
          stocksObj[bg] = res.data.stocks?.[bg] || 0;
          lentObj[bg] = res.data.bloodLent?.[bg] || 0;
        });
        
        setStocks(stocksObj);
        setBloodLent(lentObj);
      }
    } catch (err) {
      console.error("Failed to load inventory", err);
    } finally {
      setLoading(false);
    }
  };
  
  const loadLendingHistory = async () => {
    try {
      const res = await api.get("/inventory/lending-history");
      setLendingHistory(res.data);
    } catch (err) {
      console.error("Failed to load lending history", err);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setStocks((s) => ({ ...s, [name]: Number(value) }));
  };

  const saveInventory = async () => {
    try {
      await api.post("/inventory", { stocks });
      alert("Inventory saved successfully!");
      loadInventory();
    } catch (err) {
      alert("Failed to save inventory");
    }
  };
  
  const handleDonation = async (e) => {
    e.preventDefault();
    try {
      await api.post("/inventory/donate", donationForm);
      alert(`${donationForm.units} units of ${donationForm.bloodGroup} added to inventory!`);
      setDonationForm({ bloodGroup: "O+", units: 1 });
      loadInventory();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add donation");
    }
  };
  
  const handleLending = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!lendingForm.receiverName || !lendingForm.receiverAddress || !lendingForm.receiverPhone) {
      alert("Please fill in receiver name, address, and phone number");
      return;
    }
    
    try {
      await api.post("/inventory/lend", lendingForm);
      alert(`${lendingForm.units} units of ${lendingForm.bloodGroup} lent to ${lendingForm.receiverName}!`);
      setLendingForm({ 
        bloodGroup: "O+", 
        units: 1,
        receiverName: "",
        receiverAddress: "",
        receiverPhone: "",
        receiverEmail: "",
        notes: ""
      });
      loadInventory();
      loadLendingHistory();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to lend blood");
    }
  };

  return (
    <main className="layout" style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2>Blood Inventory Management</h2>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          ← Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div className="card">Loading...</div>
      ) : (
        <>
          {/* DONATION AND LENDING FORMS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Donor Donation Form */}
            <div className="card">
              <h3>Record Donor Donation</h3>
              <p className="small grey" style={{ marginBottom: "1rem" }}>
                Add blood donated by donors to inventory
              </p>
              <form onSubmit={handleDonation}>
                <div style={{ marginBottom: '1rem' }}>
                  <div className="label">Blood Group</div>
                  <select 
                    className="input"
                    value={donationForm.bloodGroup}
                    onChange={(e) => setDonationForm({...donationForm, bloodGroup: e.target.value})}
                  >
                    {Object.keys(stocks).map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div className="label">Units</div>
                  <input 
                    type="number" 
                    className="input"
                    min="1"
                    value={donationForm.units}
                    onChange={(e) => setDonationForm({...donationForm, units: Number(e.target.value)})}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Add to Inventory</button>
              </form>
            </div>

            {/* Lend to Receiver Form */}
            <div className="card">
              <h3>Lend Blood to Receiver</h3>
              <p className="small grey" style={{ marginBottom: "1rem" }}>
                Record receiver details and lend blood from inventory
              </p>
              <form onSubmit={handleLending}>
                <div style={{ marginBottom: '1rem' }}>
                  <div className="label">Blood Group *</div>
                  <select 
                    className="input"
                    value={lendingForm.bloodGroup}
                    onChange={(e) => setLendingForm({...lendingForm, bloodGroup: e.target.value})}
                  >
                    {Object.keys(stocks).map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div className="label">Units *</div>
                  <input 
                    type="number" 
                    className="input"
                    min="1"
                    value={lendingForm.units}
                    onChange={(e) => setLendingForm({...lendingForm, units: Number(e.target.value)})}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div className="label">Receiver Name *</div>
                  <input 
                    type="text" 
                    className="input"
                    placeholder="e.g., John Doe"
                    value={lendingForm.receiverName}
                    onChange={(e) => setLendingForm({...lendingForm, receiverName: e.target.value})}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div className="label">Receiver Address *</div>
                  <textarea 
                    className="input"
                    placeholder="Full address"
                    rows="2"
                    value={lendingForm.receiverAddress}
                    onChange={(e) => setLendingForm({...lendingForm, receiverAddress: e.target.value})}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div className="label">Receiver Phone *</div>
                  <input 
                    type="tel" 
                    className="input"
                    placeholder="e.g., +1234567890"
                    value={lendingForm.receiverPhone}
                    onChange={(e) => setLendingForm({...lendingForm, receiverPhone: e.target.value})}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div className="label">Receiver Email (Optional)</div>
                  <input 
                    type="email" 
                    className="input"
                    placeholder="e.g., john@example.com"
                    value={lendingForm.receiverEmail}
                    onChange={(e) => setLendingForm({...lendingForm, receiverEmail: e.target.value})}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div className="label">Notes (Optional)</div>
                  <textarea 
                    className="input"
                    placeholder="Additional information..."
                    rows="2"
                    value={lendingForm.notes}
                    onChange={(e) => setLendingForm({...lendingForm, notes: e.target.value})}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Lend to Receiver</button>
              </form>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* LEFT SIDE - Manage Stock */}
          <div className="card">
            <h3>Manage Blood Stock</h3>
            <p className="small grey" style={{ marginBottom: "1.5rem" }}>
              Update the available units for each blood group. Public users can view your updated stock.
            </p>

            <div className="inventory-grid">
              {Object.keys(stocks).map((bg) => (
                <div key={bg} className="inv-card">
                  <div className="small">
                    <span className="badge badge-muted">{bg}</span> Units
                  </div>
                  <input
                    type="number"
                    className="input"
                    name={bg}
                    value={stocks[bg]}
                    min="0"
                    onChange={onChange}
                  />
                </div>
              ))}
            </div>

            <button className="btn btn-primary" onClick={saveInventory} style={{ marginTop: "1.5rem" }}>
              Save Inventory
            </button>
          </div>

          {/* RIGHT SIDE - Current Available & Blood Lent */}
          <div>
            {/* Current Available */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3>Current Available Blood</h3>
              <p className="small grey" style={{ marginBottom: "1rem" }}>
                Real-time available units in blood bank
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem' }}>
                {Object.keys(stocks).map((bg) => (
                  <div 
                    key={bg} 
                    style={{
                      padding: '0.8rem',
                      borderRadius: '0.5rem',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span className="badge badge-muted">{bg}</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 600, color: stocks[bg] > 0 ? '#4ade80' : '#f97316' }}>
                      {stocks[bg]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Blood Lent */}
            <div className="card">
              <h3>Blood Lent to Receivers</h3>
              <p className="small grey" style={{ marginBottom: "1rem" }}>
                Total units lent from fulfilled requests
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem' }}>
                {Object.keys(bloodLent).map((bg) => (
                  <div 
                    key={bg} 
                    style={{
                      padding: '0.8rem',
                      borderRadius: '0.5rem',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span className="badge badge-muted">{bg}</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#60a5fa' }}>
                      {bloodLent[bg]}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(59,130,246,0.1)', borderRadius: '0.5rem' }}>
                <strong>Total Units Lent: </strong>
                <span style={{ fontSize: '1.1rem', color: '#60a5fa' }}>
                  {Object.values(bloodLent).reduce((a, b) => a + b, 0)}
                </span>
              </div>
            </div>
          </div>
          </div>
          
          {/* LENDING HISTORY SECTION */}
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Lending History</h3>
              <button 
                className="btn btn-outline"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Hide History' : `View History (${lendingHistory.length})`}
              </button>
            </div>
            
            {showHistory && (
              lendingHistory.length === 0 ? (
                <p style={{ color: '#9ca3af' }}>No lending records yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Blood Group</th>
                        <th>Units</th>
                        <th>Receiver Name</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lendingHistory.map((record) => (
                        <tr key={record._id}>
                          <td style={{ fontSize: '0.85rem' }}>
                            {new Date(record.lendingDate).toLocaleDateString()}
                          </td>
                          <td>
                            <span className="badge badge-muted">{record.bloodGroup}</span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{record.units}</td>
                          <td>{record.receiverName}</td>
                          <td style={{ fontSize: '0.85rem', maxWidth: '200px' }}>{record.receiverAddress}</td>
                          <td style={{ fontSize: '0.85rem' }}>{record.receiverPhone}</td>
                          <td style={{ fontSize: '0.85rem' }}>{record.receiverEmail || 'N/A'}</td>
                          <td style={{ fontSize: '0.85rem', maxWidth: '150px' }}>{record.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </>
      )}
    </main>
  );
};

export default BloodInventory;
