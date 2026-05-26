import { type ReactNode } from 'react';

const Container = ({ children }: { children: ReactNode }) => {
    return (
        <div className='mx-auto' style={{ width: "min(1250px, 90%)" }}>
            {children}
        </div>
    );
}

export default Container;
