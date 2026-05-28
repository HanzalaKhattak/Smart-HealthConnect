import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * Role-aware route guard.
 * Usage:
 *   <Route element={<ProtectedRoute />}> ... </Route>
 *   <Route element={<ProtectedRoute allowedRoles={['doctor']} />}> ... </Route>
 */
const ProtectedRoutesErrorpage = ({ allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
    // Authenticated but not the right role.
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-red-50">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Access denied</h1>
          <p className="text-gray-700 mb-6">
            You don't have permission to view this page.
          </p>
          <a href="/" className="inline-block px-5 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition">
            Back to home
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoutesErrorpage;
