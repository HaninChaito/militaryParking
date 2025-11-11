import { useEffect, useState } from "react";
import "./RequestsTable.css";
import axios from "axios";

export default function RequestsTable() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/Requests/UniversityRequests`
      );

      const formattedRequests = response.data.map((req) => ({
        id: req.Req_ID,
        fileNumber: req.UserID,
        name: `${req.FirstName} ${req.LastName}`,
        requestDate: req.Request_Date,
        occupation: req.Role,
        residenceLocation: req.Residence,
        vehicleType: req.Vehicle_Type,
        vehicleImage: req.Vehicle_Image,
        insuranceDocument: req.Insurance_Image,
        insuranceExpiry: req.Insurance_Expiration_Date,
        drivingLicense: req.Driving_License,
        status: req.Status,
        managerId: req.Manager_ID,
      }));

      setRequests(formattedRequests);
    

    } catch (error) {
      console.error(`Error fetching ${viewType} requests:`, error);
    }
  };

  const handleImageClick = (imageName) => {
    setSelectedImage(`http://localhost:5000/uploads/${imageName}`);
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/Requests/AcceptRequest`,
        { Req_ID: id }
      );

      console.log(response.data.msg);
      fetchRequests();

const email = await fetch(`${import.meta.env.VITE_API_URL}/Requests/send-email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: response.data.email,
    subject: 'تم قبول طلبك',
    text: 'نحيطكم علمًا بأن طلبكم قد تم قبوله. يمكنكم مراجعة تفاصيل الطلب من خلال حسابكم.'
  })
});

const result = await email.json();
console.log(result);
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  // Handle reject action
  const handleReject = async (id) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/Requests/DeclineRequest`,
        { Req_ID: id }
      );

      console.log(response.data.msg);
      fetchRequests();

const email = await fetch(`${import.meta.env.VITE_API_URL}/Requests/send-email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: response.data.email,
    subject: 'تم رفض طلبك',
    text: 'نحيطكم علمًا بأن طلبكم قد تم رفضه. يمكنكم مراجعة تفاصيل الطلب من خلال حسابكم.'
  })
});


const result = await email.json();
console.log(result);

    } catch (error) {
      console.error("Error denying request:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-LB").format(date);
  };

  return (
    <div className="content-container">
      <h2 className="page-title">طلبات تصاريح الدخول</h2>

      <div className="table-container">
        <div className="table-responsive">
          <table className="requests-table" dir="rtl">
            <thead>
              <tr>
                <th>رقم ملف صاحب الطّلب</th>
                <th>الإسم</th>
                <th>تاريخ الطّلب</th>
                <th>الوظيفة</th>
                <th>مكان السّكن</th>
                <th>نوع المركبة</th>
                <th>صورة المركبة</th>
                <th>وثيقة التأمين</th>
                <th>صلاحية التّأمين</th>
                <th>رخصة القيادة</th>
                <th>رقم مراقب الطّلب</th>
                <th className="actions-column">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="table-row">
                  <td>{request.fileNumber}</td>
                  <td>{request.name}</td>
                  <td>{formatDate(request.requestDate)}</td>
                  <td>{request.occupation}</td>
                  <td>{request.residenceLocation}</td>
                  <td>{request.vehicleType}</td>
                  <td>
                    <div className="image-container">
                      <img
                        src={`http://localhost:5000/uploads/${request.vehicleImage}`}
                        alt="صورة المركبة"
                        className="thumbnail-image"
                        onClick={() => handleImageClick(request.vehicleImage)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="image-container">
                      <img
                        src={`http://localhost:5000/uploads/${request.insuranceDocument}`}
                        alt="وثيقة التأمين"
                        className="thumbnail-image"
                        onClick={() =>
                          handleImageClick(request.insuranceDocument)
                        }
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </td>
                  <td>{formatDate(request.insuranceExpiry)}</td>
                  <td>
                    <div className="image-container">
                      <img
                        src={`http://localhost:5000/uploads/${request.drivingLicense}`}
                        alt="وثيقة التأمين"
                        className="thumbnail-image"
                        onClick={() => handleImageClick(request.drivingLicense)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </td>

                  <td>{request.managerId}</td>

                  <td>
                    <div className="actions-container">
                      <div className="buttons-row">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="approve-button"
                        >
                          قبول
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="reject-button"
                        >
                          رفض
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="عرض الصوورة" className="modal-image" />
            <button className="modal-close-button" onClick={closeModal}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
