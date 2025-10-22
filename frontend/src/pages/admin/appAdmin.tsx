import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import InfoManagement from "./InfoManagement";
const AppAdmin: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          {/* <Route index element={<></>} /> */}
          <Route path="/info-management" element={<InfoManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppAdmin;
