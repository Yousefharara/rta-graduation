import { useEffect } from 'react';
import { useAppSelector } from '../../../redux/store';

const About = () => {

    const {role} = useAppSelector(state => state.auth);

    useEffect(() => {
        console.log("Role , ", typeof role);
    }, [role]);

    return (
        <div className='p-8'>
            <h2>About page</h2>
            <p className='rounded-md w-fit border border-gray-300 p-4 text-emerald-600'>Role is : {role.toString()}</p>
        </div>
    );
}

export default About;
