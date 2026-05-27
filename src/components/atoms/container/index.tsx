import { type ReactNode } from 'react';

const Container = ({ children, className }: { children: ReactNode, className?: string }) => {
    return (
        <div className={`mx-auto ${className}`} style={{ width: "min(1250px, 90%)" }}>
            {children}
        </div>
    );
}

export default Container;
