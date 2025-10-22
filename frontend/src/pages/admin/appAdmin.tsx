import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import InfoManagement from "./InfoManagement";
import CheckInManager from "../employee/CheckInManager";
import CheckOutManager from "../employee/CheckOutManager";
const AppAdmin: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          {/* <Route index element={<></>} /> */}
          <Route path="/info-management" element={<InfoManagement />} />
          <Route path="/checkin-management" element={<CheckInManager />} />
          <Route path="/checkout-management" element={<CheckOutManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppAdmin;
