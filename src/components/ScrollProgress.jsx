import React, { useState, useEffect } from 'react';

const ScrollProgress = ({ sections }) => {
    const [activeSection, setActiveSection] = useState('');

    const handleScroll = () => {
        const scrollPosition = window.pageYOffset;
        const active = Object.keys(sections).find(key => {
            const section = sections[key].current;
            if (section) {
                return (
                    section.offsetTop <= scrollPosition &&
                    section.offsetTop + section.offsetHeight > scrollPosition
                );
            }
            return false;
        });
        setActiveSection(active);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="scroll-progress">
            {Object.keys(sections).map(key => (
                <a
                    key={key}
                    href={`#${key}`}
                    onClick={(e) => {
                        e.preventDefault();
                        sections[key].current.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={activeSection === key ? 'active' : ''}
                >
                    {key}
                </a>
            ))}
        </div>
    );
};

export default ScrollProgress;