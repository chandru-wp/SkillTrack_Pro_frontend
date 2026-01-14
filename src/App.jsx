 import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import AddEntry from "./pages/AddEntry"
import MyEntries from "./pages/MyEntries"
import AdminDashboard from "./pages/AdminDashboard"

function App() {
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route 
          path="/" 
          element={
            user 
              ? (user.role === 'admin' || user.role === 'super_admin' ? <Navigate to="/admin01" /> : <Navigate to="/add-entry01" />) 
              : <Login />
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin01" element={<AdminDashboard />} />
        <Route path="/add-entry01" element={<AddEntry />} />
        <Route path="/entries01" element={<MyEntries />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
