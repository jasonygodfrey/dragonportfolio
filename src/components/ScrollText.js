import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

const ScrollText = () => {
    const [showScrollText, setShowScrollText] = useState(false);

    useEffect(() => {
        let animation;
        const fadeInOutAnimation = () => {
            if (showScrollText) {
                animation = gsap.fromTo("#scrollText", 
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

        // Start displaying and animating the scroll text after 24000 milliseconds
        const delayTimer = setTimeout(() => {
            setShowScrollText(true);
            fadeInOutAnimation();
            window.addEventListener('scroll', handleScroll);
        }, 24000);

        return () => {
            clearTimeout(delayTimer);
            window.removeEventListener('scroll', handleScroll);
            if (animation) animation.kill();
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
            fontFamily: '"nobel-book", sans-serif',
            zIndex: 9999910000,
            opacity: 1
        }}>
            
        </div>
    ) : null;
};

export default ScrollText;
