import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';
import BarangList from './pages/Admin/BarangList';
import BarangForm from './pages/Admin/BarangForm';
import PenjualanList from './pages/Admin/PenjualanList';
import DetailPenjualan from './pages/Admin/DetailPenjualan';
import KasirDashboard from './pages/Kasir/KasirDashboard';
import KasirPointOfSale from './pages/Kasir/KasirPointOfSale';
import NotFound from './pages/NotFound';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <Router>
            <div className="flex flex-col min-h-screen"> {/* Menambahkan flex-col dan min-h-screen untuk layout footer */}
                <Navbar user={user} setUser={setUser} />
                <main className="flex-grow"> {/* Menambahkan flex-grow agar konten mengisi ruang */}
                    <Routes>
                        <Route path="/login" element={<Login setUser={setUser} />} />
                        <Route path="/register" element={<Register />} />

                        {/* Admin Routes */}
                        <Route element={<PrivateRoute user={user} allowedRoles={['admin']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/barangs" element={<BarangList />} />
                            <Route path="/admin/barangs/create" element={<BarangForm />} />
                            <Route path="/admin/barangs/edit/:id" element={<BarangForm />} />
                            <Route path="/admin/penjualans" element={<PenjualanList />} />
                            <Route path="/admin/penjualans/:id" element={<DetailPenjualan />} />
                        </Route>

                        {/* Kasir Routes */}
                        <Route element={<PrivateRoute user={user} allowedRoles={['kasir']} />}>
                            <Route path="/kasir/dashboard" element={<KasirDashboard />} />
                            <Route path="/kasir/pos" element={<KasirPointOfSale />} />
                        </Route>

                        {/* Redirect based on role after login */}
                        <Route path="/" element={user ? (user.role === 'admin' ? <AdminDashboard /> : <KasirDashboard />) : <Login setUser={setUser} />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>

                {/* Footer Section */}
                <footer className="bg-gray-800 text-white p-4 text-center">
                    <p>&copy; {new Date().getFullYear()} Toko Pak Met. All rights reserved.</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
