import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import InstituteList from "./components/InstituteList";
import InstituteDetail from "./components/InstituteDetail";
import AddInstituteModal from "./components/AddInstituteModal";
import AdminDashboard from "./components/AdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css"; // Ensure the Tailwind CSS is imported

function App() {
  return (
    <div className='bg-[#111111] text-white min-h-screen'>
      <Router>
        <Routes>
          <Route path='/' element={<InstituteList />} />
          <Route path='/institute/:id' element={<InstituteDetail />} />
          <Route path='/admin' element={<AdminDashboard />} />
        </Routes>
        <ToastContainer position='bottom-right' />
      </Router>
    </div>
  );
}

export default App;
