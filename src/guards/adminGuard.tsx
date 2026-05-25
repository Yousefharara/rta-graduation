import React from 'react';
import { useAppSelector } from '../redux/store';
import { ROLES } from '../constants/roles';
import { Outlet } from 'react-router-dom';

const AdminGuard = () => {

    const {role} = useAppSelector(state => state.auth)

    if(role === ROLES.ADMIN) return <Outlet />;
}

export default AdminGuard;
