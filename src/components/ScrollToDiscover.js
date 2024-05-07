import React, { useEffect, useState } from 'react';
const ScrollToDiscover = ({ targetRef }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleScroll = () => {
        setIsVisible(window.pageYOffset === 0);
    };

    const scrollToTarget = () => {
        if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div
            className={`scroll-discover-container ${isVisible ? 'homepage-scroll' : ''}`}
            onClick={scrollToTarget}
            role="button"
            tabIndex={0}
        >
            <div className="scroll-icon">
                <svg className="circle-svg" viewBox="0 0 38 38">
                    <circle cx="19" cy="19" r="18" fill="none" />
                </svg>
                <div className="bars">
                    <div className="bar bar-1"></div>
                    <div className="bar bar-2"></div>
                </div>
            </div>
            <div className="scroll-discover-text">
                {`Discover`.split('').map((char, index) => (
                    <span key={index} className={`char char-${index + 1}`}>
                        {char}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ScrollToDiscover;