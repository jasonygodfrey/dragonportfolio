import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const ScrollProgress = ({ sections }) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        setIsVisible(window.pageYOffset > 0);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`scroll-progress ${isVisible ? 'visible' : ''}`}>
            {Object.keys(sections).map((section, index) => (
                <Link
                    key={index}
                    to={`#${section}`}
                    className={window.location.hash === `#${section}` ? 'active' : ''}
                    onClick={(e) => {
                        e.preventDefault();
                        sections[section].current.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    {section}
                </Link>
            ))}
        </div>
    );
};

export default ScrollProgress;
