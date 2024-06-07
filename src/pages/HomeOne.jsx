import React, { useRef, useState, useEffect } from 'react';
import '../scss/components/section.scss';
import '../scss/components/box.scss';
import Slider from '../components/slider';
import dataSlider from '../assets/fake-data/data-slider';
import About from '../features/about';
import Project from '../features/project';
import dataProject from '../assets/fake-data/dataProject';
import dataAbout from '../assets/fake-data/data-about';
import RoadMap from '../features/roadmap';
import dataRoadmap from '../assets/fake-data/data-roadmap';
import Work from '../features/work';
import dataWork from '../assets/fake-data/data-work';
import Team from '../features/team';
import dataTeam from '../assets/fake-data/data-team';
import Blog from '../features/blog';
import dataBlog from '../assets/fake-data/data-blog';
import Partner from '../features/partner';
import dataPartner from '../assets/fake-data/data-partner';
import FAQ from '../features/faq';
import dataFaq from '../assets/fake-data/data-faq';
import ThreeBackground from '../components/ThreeBackground';
import ThreeBackground2 from '../components/ThreeBackground2';
import PageTitle from '../components/pagetitle';
import { Link } from 'react-router-dom';
import img1 from '../assets/images/background/bg-ft.png';
import img2 from '../assets/images/background/bg-ft2.png';
import ScrollProgress from '../components/ScrollProgress';
import ScrollToDiscover from '../components/ScrollToDiscover';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

function HomeOne(props) {
    const threeBackgroundRef = useRef(null);
    const aboutRef = useRef(null);
    const gamedevRef = useRef(null);
    const webdevRef = useRef(null);
    const contactRef = useRef(null);
    const threeBackground2Ref = useRef(null);

    const sections = {
        About: aboutRef,
        WebDev: webdevRef,
        GameDev: gamedevRef,
        Contact: contactRef
    };

    const [projectStyle, setProjectStyle] = useState({ position: 'relative', top: '-400px' });
    const [isVisible, setIsVisible] = useState(false);
    const [showScrollText, setShowScrollText] = useState(false);

    useEffect(() => {
        const updateStyle = () => {
            if (window.innerWidth <= 768) {
                setProjectStyle({ position: 'relative', top: '-150px' });
            } else {
                setProjectStyle({ position: 'relative', top: '-400px' });
            }
        };

        const toggleVisibility = () => {
            setIsVisible(window.pageYOffset > 500);
        };

        window.addEventListener('resize', updateStyle);
        window.addEventListener('scroll', toggleVisibility);

        updateStyle();

        return () => {
            window.removeEventListener('resize', updateStyle);
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const smoothScrollTo = (target) => {
        gsap.to(window, { duration: 1, scrollTo: { y: target, autoKill: false } });
    };

    const scrollToTop = () => {
        smoothScrollTo(0);
    };

    const scrollToContact = () => {
        smoothScrollTo(contactRef.current.offsetTop);
    };

    const homeStyle = {
        position: 'relative',
        zIndex: 1,
    };

    const fullScreenSection = {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        textAlign: 'center',
        color: '#fff',
    };

    const pixelatedStyle = {
        maxWidth: '80%',
        height: 'auto',
        imageRendering: 'pixelated',
        transition: 'opacity 2s ease',
        opacity: 0,
    };

    const handleImageLoad = (event) => {
        event.target.style.opacity = 1;
    };

    const [showScene, setShowScene] = useState(true);

    // Disable scrolling and hide scrollbar initially
    useEffect(() => {
        const preventScroll = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        document.body.style.overflowY = 'hidden';
        document.body.style.overflowX = 'hidden';
        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });

        const timer = setTimeout(() => {
            if (threeBackground2Ref.current) {
                gsap.to(threeBackground2Ref.current, {
                    opacity: 0,
                    duration: 3.5,
                    ease: 'power2.inOut',
                }).then(() => {
                    setTimeout(() => {
                        setShowScene(false);
                    }, 3500);
                });
            }

            // Re-enable scrolling and show scrollbar after 10 seconds
            document.body.style.overflowY = 'auto';
            document.body.style.overflowX = 'hidden';
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
        }, 10000);

        const scrollTextTimer = setTimeout(() => {
            setShowScrollText(true);
            gsap.fromTo("#scrollText", 
                { opacity: 0 }, 
                { opacity: 1, duration: 2, repeat: -1, yoyo: true }
            );
        },14000);

        return () => {
            clearTimeout(timer);
            clearTimeout(scrollTextTimer);
            document.body.style.overflowY = 'auto';
            document.body.style.overflowX = 'hidden';
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
        };
    }, []);

    return (
        <div className='home-1' style={homeStyle}>
            {showScene && (
                <div ref={threeBackground2Ref} style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 9999999,
                    opacity: 1,
                    transition: 'opacity 2s ease',
                }}>
                    <ThreeBackground2 style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }} />
                </div>
            )}
            <section style={fullScreenSection}>
            </section>

            <ThreeBackground style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                minWidth: '100%',
                minHeight: '100%',
                width: 'auto',
                height: 'auto',
                zIndex: -1,
                objectFit: 'cover',
            }} />

            <Slider data={dataSlider} /> 

            <About data={dataAbout} style={{ position: 'relative', top: '-150px' }} />
            <div>
                <PageTitle title='Contact ' />

                <section className="tf-section tf-contact">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="content-about m-b50 mobie-40" data-aos="fade-right" data-aos-duration="800">
                                    <div className="tf-title st2 m-b17">
                                        <h4 className="title">Contact Us</h4>
                                    </div>
                                    <p className="m-r-40">Thank you for your interest. Please contact us if you have any interest or question regarding web design, graphic design, digital marketing, and other design and general web-related services we provide. We will propose an appropriate service according to what our client needs. (Initial consultation is free.) We will respond to your inquiry as soon as possible.</p>
                                </div>
                                <form action="contact/contact-process.php" className="form-contact" id="contactform" data-aos="fade-right" data-aos-duration="800">
                                    <fieldset>
                                        <input type="text" name="name" id="name" placeholder="Name" />
                                    </fieldset>
                                    <fieldset>
                                        <input type="email" name="mail" id="mail" placeholder="Email Address" />
                                    </fieldset>
                                    <fieldset>
                                        <input type="number" name="phone" id="phone" placeholder="Phone" />
                                    </fieldset>
                                    <fieldset>
                                        <textarea placeholder="Type your Message" rows="5" tabIndex="4" name="message" className="message" id="message"></textarea>
                                    </fieldset>
                                    <button className="tf-button btn-effect" type="submit" style={{ display: 'block', margin: '0 auto' }}>
                                        <span className="boder-fade"></span>
                                        <span className="effect">Send Message</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {showScrollText && (
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
            )}

            <footer id="footer">
                <div className="footer-main">
                    <img src={img1} alt="" className="bg1" />
                    <img src={img2} alt="" className="bg2" />
                </div>
                <div className="footer-bottom">
                    <div className="container">
                        <div className="wrap-fx">
                            <div className="Copyright">
                                <p>Samurai Studios 2024 - All rights reserved</p>
                            </div>
                        </div>
                    </div>
                </div>

                {isVisible && <Link onClick={scrollToTop} to='#' id="scroll-top"></Link>}
            </footer>
        </div>
    );
}

export default HomeOne;
