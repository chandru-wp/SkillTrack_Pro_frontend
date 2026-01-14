 import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import AddEntry from "./pages/AddEntry"
import MyEntries from "./pages/MyEntries"
import AdminDashboard from "./pages/AdminDashboard"

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/add-entry" element={<AddEntry />} />
        <Route path="/entries" element={<MyEntries />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
