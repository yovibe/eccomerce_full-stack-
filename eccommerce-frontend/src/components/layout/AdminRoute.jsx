import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="py-32 text-center text-gray-400">Verifying access...</div>;
  if (!user || user.role !== 'ADMIN') return <Navigate to="/" replace />;
  
  return children;
};

export default AdminRoute;
