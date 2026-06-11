import { PATHS } from '@/routes/paths';
import { useAppSelector } from '../redux/store';
import { Navigate, Outlet } from 'react-router-dom';
import type { roles } from '@/constants/roles';

interface Props {
    allowedRoles: roles[]
}

const AdminGuard = ({allowedRoles} : Props) => {

    const { role } = useAppSelector(state => state.auth)

    if (allowedRoles.includes(role)) return <Outlet />;

    return <Navigate to={PATHS.AUTH.LOGIN} replace={true} />
}

export default AdminGuard;
