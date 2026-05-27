import { PATHS } from '@/routes/paths';
import { useAppSelector } from '../redux/store';
import { Navigate, Outlet } from 'react-router-dom';

const AdminGuard = () => {

    const {role} = useAppSelector(state => state.auth)

    if(role === "admin") return <Outlet />;

    return <Navigate to={PATHS.AUTH.LOGIN} replace={true} />
}

export default AdminGuard;
