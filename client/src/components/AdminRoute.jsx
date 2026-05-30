import { Navigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

export default function AdminRoute({ children }) {
  const { user, isAuthenticated } = useGlobal();
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to='/' replace />;
  }
  
  return children;
}
