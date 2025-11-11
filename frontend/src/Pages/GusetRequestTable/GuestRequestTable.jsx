import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import "./GuestRequestTable.css";

export default function GuestRequestTable() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5002/GuestRequests/GuestRequests"
      );

      const formattedRequests = response.data.map((req) => ({
        id: req.RequestId,
        name: req.GuestName,
        managerId: req.ManagerId,
        requestDate: req.RequestCreatedAt,
        Purpose: req.Purpose,
        GuestPhone: req.GuestPhone,
        EntryDate: req.EntryDate,
        EntryTime: req.EntryTime,
        ExitDate: req.ExitDate,
        status: req.Status,
        vehicleType: req.Vehicle_Type,
        vehicleImage: req.Vehicle_Image,
        insuranceDocument: req.Insurance_Image,
        insuranceExpiry: req.Insurance_Expiration_Date,
        drivingLicense: req.Driving_License,
      }));

      setRequests(formattedRequests);
    } catch (error) {
      console.error(`Error fetching requests:`, error);
    }
  };

  const handleImageClick = (imageName) => {
    setSelectedImage(`http://localhost:5001/uploads/${imageName}`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {

      console.log(id);
      const response = await axios.post(
        "http://localhost:5002/GuestRequests/AcceptGuestRequest",
        { RequestId: id }
      );

      console.log(response.data.msg);
      fetchRequests();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  // Handle reject action
  const handleReject = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:5002/GuestRequests/DeclineGuestRequest",
        { RequestId: id } 
      );

      console.log(response.data.msg);
      fetchRequests();
    } catch (error) {
      console.error("Error denying request:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير متوفر"; // Fallback if null or empty
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "تاريخ غير صالح"; // Invalid date string
    return new Intl.DateTimeFormat("ar-LB").format(date);
  };

  return (
    <div className="content-container">
      <h2 className="page-title">طلبات تصاريح الدخول</h2>

      <div className="table-container">
        <div className="table-responsive">
          <table className="requests-table" dir="rtl">
            <tbody>
              {requests.map((request, index) => (
                <React.Fragment key={index}>
                  <tr className="section-header">
                    <td colSpan="3">معلومات الزائر</td>
                  </tr>
                  <tr>
                    <td>الاسم</td>
                    <td>:</td>
                    <td>{request.name}</td>
                  </tr>
                  <tr>
                    <td>رقم الهاتف</td>
                    <td>:</td>
                    <td>{request.GuestPhone}</td>
                  </tr>
                  <tr>
                    <td>تاريخ الدخول</td>
                    <td>:</td>
                    <td>{formatDate(request.EntryDate)}</td>
                  </tr>
                  <tr>
                    <td>وقت الدخول</td>
                    <td>:</td>
                    <td>{request.EntryTime}</td>
                  </tr>
                  <tr>
                    <td>تاريخ الخروج</td>
                    <td>:</td>
                    <td>{formatDate(request.ExitDate)}</td>
                  </tr>
                  <tr>
                    <td>سبب الزيارة</td>
                    <td>:</td>
                    <td>{request.Purpose}</td>
                  </tr>

                  <tr className="section-header">
                    <td colSpan="3">معلومات المركبة</td>
                  </tr>
                  <tr>
                    <td>نوع المركبة</td>
                    <td>:</td>
                    <td>{request.vehicleType}</td>
                  </tr>
                  <tr>
                    <td>صورة المركبة</td>
                    <td>:</td>
                    <td>
                      <img
                        src={`http://localhost:5001/uploads/${request.vehicleImage}`}
                        alt="صورة المركبة"
                        className="thumbnail-image"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleImageClick(request.vehicleImage)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>وثيقة التأمين</td>
                    <td>:</td>
                    <td>
                      <img
                        src={`http://localhost:5001/uploads/${request.insuranceDocument}`}
                        alt="وثيقة التأمين"
                        className="thumbnail-image"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleImageClick(request.insuranceDocument)
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>تاريخ انتهاء التأمين</td>
                    <td>:</td>
                    <td>{formatDate(request.insuranceExpiry)}</td>
                  </tr>
                  <tr>
                    <td>رخصة القيادة</td>
                    <td>:</td>
                    <td>
                      <img
                        src={`http://localhost:5001/uploads/${request.drivingLicense}`}
                        alt="رخصة القيادة"
                        className="thumbnail-image"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleImageClick(request.drivingLicense)}
                      />
                    </td>
                  </tr>

                  <tr className="section-header">
                    <td colSpan="3">تفاصيل إضافية</td>
                  </tr>
                  <tr>
                    <td>رقم المدير</td>
                    <td>:</td>
                    <td>{request.managerId}</td>
                  </tr>
                  <tr>
                    <td>تاريخ الطلب</td>
                    <td>:</td>
                    <td>{formatDate(request.requestDate)}</td>
                  </tr>
                  
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      <button
                        onClick={() =>  handleApprove(request.id)}
                        className="approve-btn"
                      >
                        قبول
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="reject-btn"
                      >
                        رفض
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="عرض الصورة" className="modal-image" />
            <button className="modal-close-button" onClick={closeModal}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
