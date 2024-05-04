import React , { useState , useEffect } from 'react';

import { Link , NavLink } from 'react-router-dom';
import menus from '../../pages/menu';

import './styles.scss';
import logo from '../../assets/images/logo/logo.png'
import Button from '../button';



const Header = () => {

    const [scroll, setScroll] = useState(false);
        useEffect(() => {
        window.addEventListener("scroll", () => {
            setScroll(window.scrollY > 300);
        });
        return () => {
            setScroll({});
        }
    }, []);

    const [menuActive, setMenuActive] = useState(null);

    const handleMenuActive = () => {
        setMenuActive(!menuActive);
      };

    
    const [activeIndex, setActiveIndex] = useState(null);
    const handleDropdown = index => {
        setActiveIndex(index); 
    };


     // Determine the screen width
     const [windowWidth, setWindowWidth] = useState(window.innerWidth);

     useEffect(() => {
         const handleResize = () => {
             setWindowWidth(window.innerWidth);
         };
 
         window.addEventListener('resize', handleResize);
 
         // Clean up the event listener when the component unmounts
         return () => window.removeEventListener('resize', handleResize);
     }, []);
 
     // Define the logo style based on the screen width
     const logoStyle = {
         width: windowWidth > 768 ? '25%' : '80%', // Adjust '50%' as needed for mobile
         height: 'auto'
     };
 

    return (
        <header id="header_main" className={`header ${scroll ? 'is-fixed' : ''}`}>
            <div className="container">
                <div id="site-header-inner">
                    <div className="header__logo">
                    <NavLink to="/">
                <img src={logo} alt="Logo" style={logoStyle} />
            </NavLink>
                    </div>
                    <nav id="main-nav" className={`main-nav ${menuActive ? 'active' : ''}`} >
                        <ul id="menu-primary-menu" className="menu">

                            {
                                menus.map((data,idx) => (
                                    <li key={idx} onClick={()=> handleDropdown(idx)} className={`menu-item ${data.namesub ? 'menu-item-has-children' : ''} ${activeIndex === idx ? 'active' : ''}`} 
                                    
                                    >
                                        <Link to={data.links}>{data.name}</Link>
                                        {
                                            data.namesub &&
                                            <ul className="sub-menu">
                                                {
                                                    data.namesub.map((submenu) => (
                                                        <li key={submenu.id} className="menu-item"><NavLink to={submenu.links}>{submenu.sub}</NavLink></li>
                                                    ))
                                                }
                                            </ul>
                                        }
                                        
                                    </li>
                                ))
                            }
                        </ul>
                    </nav>
                    {/* <Button title='join discord' path='/contact' /> */}


                    <div className={`mobile-button ${menuActive ? 'active' : ''}`} onClick={handleMenuActive}><span></span></div>
                </div>
            </div>
        </header>
    );
}

export default Header;