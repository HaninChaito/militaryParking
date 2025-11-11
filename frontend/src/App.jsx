import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import RequestsTable from "./Pages/RequestsTable/RequestsTable";
import VehicleEntryExitLog from "./Pages/VehicleEntryExitLog/VehicleEntryExitLog";
import GuestRequestTable from "./Pages/GusetRequestTable/GuestRequestTable";
import AddAcademicYear from "./Pages/AcademicYearManager/AcademicYearManager";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/RequestsTable" element={<RequestsTable/>} />
          <Route path="/GuestRequestsTable" element={<GuestRequestTable/>} />
          <Route path="/VehiclesEntryExitLog" element={<VehicleEntryExitLog/>} />
          <Route path="/AddAcademicYear" element={<AddAcademicYear/>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
