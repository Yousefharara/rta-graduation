import React, { useEffect } from 'react';
import { useAuthContext } from '../../../context/AuthContext';

const About = () => {

    const {role} = useAuthContext();

    useEffect(() => {
        console.log("Role , ", role);
    })

    return (
        <div className='p-8'>
            <h2>About page</h2>
            <p className='rounded-md w-fit border border-gray-300 p-4 text-emerald-600'>Role is : {role}</p>
        </div>
    );
}

export default About;
