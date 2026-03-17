import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Zap, Plus, LogOut, Edit2, Trash2, Save, X } from 'lucide-react';
import './DispensaryDashboard.css';

export default function DispensaryDashboard() {
  const [deals, setDeals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState({
    strain: '',
    type: 'Hybrid',
    price: '',
    originalPrice: '',
    quantity: '3.5g',
    thc: '',
    cbd: '',
    terpenes: '',
    effects: '',
    medical: '',
    dispensary: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    // Real-time listener for deals
    const q = query(collection(db, 'deals'), where('userId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dealsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDeals(dealsData);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dealData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice),
      discount: Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100),
      terpenes: formData.terpenes.split(',').map(t => t.trim()),
      effects: formData.effects.split(',').map(e => e.trim()),
      medical: formData.medical.split(',').map(m => m.trim()),
      userId: auth.currentUser.uid,
      createdAt: new Date().toISOString(),
      active: true
    };

    try {
      if (editingDeal) {
        await updateDoc(doc(db, 'deals', editingDeal.id), dealData);
        setEditingDeal(null);
      } else {
        await addDoc(collection(db, 'deals'), dealData);
      }
      
      setFormData({
        strain: '',
        type: 'Hybrid',
        price: '',
        originalPrice: '',
        quantity: '3.5g',
        thc: '',
        cbd: '',
        terpenes: '',
        effects: '',
        medical: '',
        dispensary: '',
        address: '',
        phone: ''
      });
      setShowAddForm(false);
    } catch (error) {
      alert('Error saving deal: ' + error.message);
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setFormData({
      strain: deal.strain,
      type: deal.type,
      price: deal.price,
      originalPrice: deal.originalPrice,
      quantity: deal.quantity,
      thc: deal.thc,
      cbd: deal.cbd,
      terpenes: Array.isArray(deal.terpenes) ? deal.terpenes.join(', ') : deal.terpenes,
      effects: Array.isArray(deal.effects) ? deal.effects.join(', ') : deal.effects,
      medical: Array.isArray(deal.medical) ? deal.medical.join(', ') : deal.medical,
      dispensary: deal.dispensary,
      address: deal.address,
      phone: deal.phone
    });
    setShowAddForm(true);
  };

  const handleDelete = async (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await deleteDoc(doc(db, 'deals', dealId));
      } catch (error) {
        alert('Error deleting deal: ' + error.message);
      }
    }
  };

  const cancelEdit = () => {
    setEditingDeal(null);
    setShowAddForm(false);
    setFormData({
      strain: '',
      type: 'Hybrid',
      price: '',
      originalPrice: '',
      quantity: '3.5g',
      thc: '',
      cbd: '',
      terpenes: '',
      effects: '',
      medical: '',
      dispensary: '',
      address: '',
      phone: ''
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <Zap className="dashboard-logo" />
          <div>
            <h1>Dispensary Dashboard</h1>
            <p>{auth.currentUser?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button">
          <LogOut className="button-icon" />
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="deals-header">
          <h2>Your Deals ({deals.length})</h2>
          {!showAddForm && (
            <button onClick={() => setShowAddForm(true)} className="add-button">
              <Plus className="button-icon" />
              Add New Deal
            </button>
          )}
        </div>

        {showAddForm && (
          <div className="deal-form-container">
            <div className="form-header">
              <h3>{editingDeal ? 'Edit Deal' : 'Add New Deal'}</h3>
              <button onClick={cancelEdit} className="cancel-button">
                <X className="button-icon" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="deal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Strain Name *</label>
                  <input
                    type="text"
                    name="strain"
                    value={formData.strain}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Type *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} required>
                    <option value="Indica">Indica</option>
                    <option value="Sativa">Sativa</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Sale Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Original Price *</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 3.5g"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>THC % *</label>
                  <input
                    type="text"
                    name="thc"
                    value={formData.thc}
                    onChange={handleInputChange}
                    placeholder="e.g., 18-24%"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>CBD %</label>
                  <input
                    type="text"
                    name="cbd"
                    value={formData.cbd}
                    onChange={handleInputChange}
                    placeholder="e.g., 0.1%"
                  />
                </div>

                <div className="form-group">
                  <label>Dispensary Name *</label>
                  <input
                    type="text"
                    name="dispensary"
                    value={formData.dispensary}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Terpenes (comma-separated) *</label>
                  <input
                    type="text"
                    name="terpenes"
                    value={formData.terpenes}
                    onChange={handleInputChange}
                    placeholder="Myrcene, Pinene, Caryophyllene"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Effects (comma-separated) *</label>
                  <input
                    type="text"
                    name="effects"
                    value={formData.effects}
                    onChange={handleInputChange}
                    placeholder="Relaxed, Happy, Creative"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Medical Uses (comma-separated) *</label>
                  <input
                    type="text"
                    name="medical"
                    value={formData.medical}
                    onChange={handleInputChange}
                    placeholder="Pain, Stress, Insomnia"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={cancelEdit} className="cancel-form-button">
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  <Save className="button-icon" />
                  {editingDeal ? 'Update Deal' : 'Add Deal'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="deals-grid">
          {deals.map(deal => (
            <div key={deal.id} className="deal-item">
              <div className="deal-item-header">
                <div>
                  <h3>{deal.strain}</h3>
                  <span className={`deal-type ${deal.type.toLowerCase()}`}>{deal.type}</span>
                </div>
                <div className="deal-actions">
                  <button onClick={() => handleEdit(deal)} className="icon-button edit">
                    <Edit2 className="button-icon" />
                  </button>
                  <button onClick={() => handleDelete(deal.id)} className="icon-button delete">
                    <Trash2 className="button-icon" />
                  </button>
                </div>
              </div>
              
              <div className="deal-item-body">
                <div className="deal-price">
                  <span className="current">${deal.price}</span>
                  <span className="original">${deal.originalPrice}</span>
                  <span className="discount">{deal.discount}% OFF</span>
                </div>
                <div className="deal-details">
                  <p><strong>THC:</strong> {deal.thc}</p>
                  <p><strong>Quantity:</strong> {deal.quantity}</p>
                  <p><strong>Phone:</strong> {deal.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {deals.length === 0 && !showAddForm && (
          <div className="empty-state">
            <h3>No deals yet</h3>
            <p>Click "Add New Deal" to create your first deal</p>
          </div>
        )}
      </div>
    </div>
  );
}
