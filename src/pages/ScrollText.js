// src/components/ScrollText.js

import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

const ScrollText = () => {
    const [showScrollText, setShowScrollText] = useState(true);

    useEffect(() => {
        const fadeInOutAnimation = () => {
            if (showScrollText) {
                gsap.fromTo("#scrollText", 
                    { opacity: 0 }, 
                    { opacity: 1, duration: 2, repeat: -1, yoyo: true }
                );
            }
        };

        const handleScroll = () => {
            if (window.pageYOffset > 100) {
                gsap.to("#scrollText", { opacity: 0, duration: 2, onComplete: () => setShowScrollText(false) });
                window.removeEventListener('scroll', handleScroll);
            }
        };

        fadeInOutAnimation();
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [showScrollText]);

    return showScrollText ? (
        <div id="scrollText" style={{
            position: 'fixed',
            bottom: '15%',
            width: '100%',
            textAlign: 'center',
            color: '#fff',
            fontSize: '24px',
            zIndex: 9999910000,
            opacity: 1
        }}>
            Scroll down to discover
        </div>
    ) : null;
};

export default ScrollText;
