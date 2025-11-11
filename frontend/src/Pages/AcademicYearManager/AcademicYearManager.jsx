import React, { useState, useEffect } from 'react';
import './AcademicYearManager.css';

const AcademicYearManager = () => {
  const [yearLabel, setYearLabel] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [setCurrent, setSetCurrent] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

   const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-LB'); // or 'ar-LB'
  };

  const fetchYears = async () => {
    try {
      const res = await fetch('http://localhost:5002/api/academic-years/all');
      const data = await res.json();
      setAcademicYears(data);
    } catch {
      setError('Failed to fetch academic years');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5002/api/academic-years/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          YearLabel: yearLabel,
          StartDate: startDate,
          EndDate: endDate,
          SetAsCurrent: setCurrent,
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setMessage('تم اضافة العام الدراسي الجديد');
      setYearLabel('');
      setStartDate('');
      setEndDate('');
      setSetCurrent(false);
      fetchYears();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

   return (
    <div className="academic-form-container">
      <div className="academic-form-wrapper">
        <h2 className="academic-form-title">إضافة عام دراسي جديد</h2>
        
        <form onSubmit={handleSubmit} className="academic-form">
          <div className="academic-form-group">
            <label className="academic-form-label">تسمية العام الدراسي</label>
            <input
              type="text"
              className="academic-form-input"
              value={yearLabel}
              onChange={(e) => setYearLabel(e.target.value)}
              placeholder="مثال: 2025-2026"
              required
            />
          </div>

          <div className="academic-form-group">
            <label className="academic-form-label">تاريخ البدء</label>
            <input
              type="date"
              className="academic-form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="academic-form-group">
            <label className="academic-form-label">تاريخ الانتهاء</label>
            <input
              type="date"
              className="academic-form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="academic-form-checkbox">
            <label>
              <input
                type="checkbox"
                checked={setCurrent}
                onChange={(e) => setSetCurrent(e.target.checked)}
              />
              تعيين كعام حالي
            </label>
          </div>

          <button type="submit" className="academic-form-button">إضافة</button>
        </form>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="academic-years-list">
          <h3 className="academic-years-title">العام الدراسي الحالي</h3>
          {academicYears.map((y) => (
            <div key={y.AcademicYearID} className="academic-year-item">
              <span>
                {y.YearLabel} ({formatDate(y.StartDate)} → {formatDate(y.EndDate)})
                {y.IsCurrent && ' ✅ الحالي'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicYearManager;