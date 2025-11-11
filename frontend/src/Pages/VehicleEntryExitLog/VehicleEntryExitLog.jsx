import React, { useEffect, useState } from "react";
import "./VehicleEntryExitLog.css";
import axios from "axios";

const VehicleEntryExitLog = () => {
  const [activeTab, setActiveTab] = useState("entry");
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState([]);
  const [searchPlate, setSearchPlate] = useState(""); // For plate number search
  const [selectedDate, setSelectedDate] = useState(""); // For date filter

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/logs/GetStats`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    }
    fetchLogs();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [activeTab]);

  const handleSearchChange = (e) => {
    setSearchPlate(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const fetchLogs = async () => {
    let endpoint = "";

    if (activeTab === "entry") {
      endpoint = "GetEntryLogs";
    } else if (activeTab === "exit") {
      endpoint = "GetExitLogs";
    } else {
      endpoint = "GetVehicleLogs";
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/logs/${endpoint}`
      );

      let filteredLogs = response.data;

      // Apply search filter
      if (searchPlate) {
        filteredLogs = filteredLogs.filter((req) =>
          req.Plate_Nb.includes(searchPlate)
        );
      }

      if (selectedDate) {
        filteredLogs = filteredLogs.filter((req) => {
          const rawDate = activeTab === "entry" ? req.EntryDate : req.ExitDate;

          if (!rawDate || typeof rawDate !== "string") return false;

          const parts = rawDate.split("-");

          if (parts.length !== 3) return false;

          const day = parts[0].padStart(2, "0");
          const month = parts[1].padStart(2, "0");
          const year = "20" + parts[2];

          const normalizedDate = `${year}-${month}-${day}`;

          return normalizedDate === selectedDate;
        });
      }

      const formattedLogs = filteredLogs.map((req) => ({
        id: req.Session_ID,
        EntryDate: req.EntryDate,
        EntryTime: req.EntryTime,
        ExitDate: req.ExitDate,
        ExitTime: req.ExitTime,
        Plate_Nb: req.Plate_Nb,
      }));

      setLogs(formattedLogs);
    } catch (error) {
      console.error("Error fetching Logs:", error);
    }
  };

  function calculateDuration(entryDate, entryTime, exitDate, exitTime) {
    if (!exitDate || !exitTime) {
      return "لم يغادر بعد"; // "Did not exit yet"
    }

    // Split the date and time
    const entryDateParts = entryDate.split("-");
    const entryTimeParts = entryTime.split(":");

    const exitDateParts = exitDate.split("-");
    const exitTimeParts = exitTime.split(":");

    // Convert entry and exit to total minutes since a fixed time (e.g., 1970-01-01)
    const entryDateInMinutes =
      parseInt(entryDateParts[0]) * 365 * 24 * 60 + // Year to minutes
      parseInt(entryDateParts[1]) * 30 * 24 * 60 + // Month to minutes
      parseInt(entryDateParts[2]) * 24 * 60 + // Day to minutes
      parseInt(entryTimeParts[0]) * 60 + // Hours to minutes
      parseInt(entryTimeParts[1]); // Minutes

    const exitDateInMinutes =
      parseInt(exitDateParts[0]) * 365 * 24 * 60 + // Year to minutes
      parseInt(exitDateParts[1]) * 30 * 24 * 60 + // Month to minutes
      parseInt(exitDateParts[2]) * 24 * 60 + // Day to minutes
      parseInt(exitTimeParts[0]) * 60 + // Hours to minutes
      parseInt(exitTimeParts[1]); // Minutes

    // Calculate the difference in minutes
    const diffMinutes = exitDateInMinutes - entryDateInMinutes;

    // If the difference is negative, the exit time is before the entry time, which is invalid
    if (diffMinutes < 0) {
      return "Invalid time range";
    }

    const days = Math.floor(diffMinutes / (24 * 60)); // Full days
    const hours = Math.floor((diffMinutes % (24 * 60)) / 60); // Full hours
    const minutes = diffMinutes % 60; // Remaining minutes

    // Return the formatted result
    return `${days > 0 ? days + " يوم " : ""}${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  return (
    <div className="vehicle-log-container">
      <div className="page-header">
        <h1>سجل دخول وخروج المركبات</h1>
        <p>مجمّع الحدث - الجامعة اللبنانية</p>
      </div>

      <div className="log-controls">
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === "entry" ? "active" : ""}`}
            onClick={() => setActiveTab("entry")}
          >
            سجل الدخول
          </button>
          <button
            className={`tab-btn ${activeTab === "exit" ? "active" : ""}`}
            onClick={() => setActiveTab("exit")}
          >
            سجل الخروج
          </button>
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            السجل الكامل
          </button>
        </div>

        <div className="log-search">
          <input
            type="text"
            placeholder="البحث برقم اللوحة..."
            className="search-input"
            value={searchPlate}
            onChange={handleSearchChange}
          />
          <div className="date-filter">
            <label>التاريخ:</label>
            <input
              type="date"
              className="date-input"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          <button className="search-btn" onClick={fetchLogs}>
            بحث
          </button>
        </div>
      </div>

      <div className="table-container">
        {activeTab === "entry" && (
          <table className="log-table">
            <thead>
              <tr>
                <th>رقم اللوحة</th>
                <th>تاريخ الدخول</th>
                <th>وقت الدخول</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((record) => (
                <tr key={record.id}>
                  <td className="plate-number">{record.Plate_Nb}</td>
                  <td>{record.EntryDate}</td>
                  <td>{record.EntryTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "exit" && (
          <table className="log-table">
            <thead>
              <tr>
                <th>رقم اللوحة</th>
                <th>تاريخ الخروج</th>
                <th>وقت الخروج</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((record) => (
                <tr key={record.id}>
                  <td className="plate-number">{record.Plate_Nb}</td>
                  <td>{record.ExitDate}</td>
                  <td>{record.ExitTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "all" && (
          <table className="log-table">
            <thead>
              <tr>
                <th>رقم اللوحة</th>
                <th>تاريخ الدخول</th>
                <th>وقت الدخول</th>
                <th>تاريخ الخروج</th>
                <th>وقت الخروج</th>
                <th>المدة</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 7).map((record) => (
                <tr key={record.id}>
                  <td className="plate-number">{record.Plate_Nb}</td>
                  <td>{record.EntryDate}</td>
                  <td>{record.EntryTime}</td>
                  <td>{record.ExitDate}</td>
                  <td>{record.ExitTime}</td>
                  <td>
                    {calculateDuration(
                      record.EntryDate,
                      record.EntryTime,
                      record.ExitDate,
                      record.ExitTime
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {stats && (
        <>
          <div className="stat-card">
            <div className="stat-title">عدد المركبات الداخلة اليوم</div>
            <div className="stat-value">{stats.enteredToday}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">عدد المركبات الخارجة اليوم</div>
            <div className="stat-value">{stats.exitedToday}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">المركبات حالياً في الداخل</div>
            <div className="stat-value">{stats.currentlyInside}</div>
          </div>
        </>
      )}

      <div className="pagination">
        <button className="pagination-btn">السابق</button>
        <div className="page-numbers">
          <button className="page-num active">1</button>
          <button className="page-num">2</button>
          <button className="page-num">3</button>
        </div>
        <button className="pagination-btn">التالي</button>
      </div>
    </div>
  );
};

export default VehicleEntryExitLog;
