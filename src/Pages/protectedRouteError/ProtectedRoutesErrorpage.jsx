import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutesErrorpage = () => {
  const token = localStorage.getItem('token');

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutesErrorpage

