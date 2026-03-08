import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Profile } from './pages/public/Profile';
import { Home } from './pages/public/Home';
import { Listings } from './pages/public/Listings';
import { PropertyDetails } from './pages/public/PropertyDetails';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

import { Dashboard } from './pages/admin/Dashboard';
import { ListingsManager } from './pages/admin/ListingsManager';
import { ListingForm } from './pages/admin/ListingForm';
import { ListingEdit } from './pages/admin/ListingEdit';
import { Users } from './pages/admin/Users';
import { Categories } from './pages/admin/Categories';
import { Locations } from './pages/admin/Locations';
import { Messages } from './pages/admin/Messages';
import { Settings } from './pages/admin/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="listings" element={<ListingsManager />} />
            <Route path="listings/new" element={<ListingForm />} />
            <Route path="listings/:id/edit" element={<ListingEdit />} />

            {/* Super Admin Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
              <Route path="users" element={<Users />} />
              <Route path="categories" element={<Categories />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="locations" element={<Locations />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
