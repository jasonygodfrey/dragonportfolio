import React, { useRef, useState, useEffect } from "react";
import "../scss/components/section.scss";
import "../scss/components/box.scss";
import Slider from "../components/slider";
import dataSlider from "../assets/fake-data/data-slider";
import About from "../features/about";
import dataAbout from "../assets/fake-data/data-about";
import PageTitle from "../components/pagetitle";
import { Link } from "react-router-dom";
import img1 from "../assets/images/background/bg-ft.png";
import img2 from "../assets/images/background/bg-ft2.png";
import ScrollText from "../components/ScrollText";
import ThreeBackground from "../components/ThreeBackground"; // Ensure these are the correct paths
import ThreeBackground2 from "../components/ThreeBackground2"; // Ensure these are the correct paths
import SmoothScroll from "../utils/SmoothScroll"; // Ensure this is the correct path to your SmoothScroll class

function HomeOne(props) {
  const threeBackgroundRef = useRef(null);
  const aboutRef = useRef(null);
  const gamedevRef = useRef(null);
  const webdevRef = useRef(null);
  const contactRef = useRef(null);
  const threeBackground2Ref = useRef(null);
  const smoothScroll = new SmoothScroll();

  const [projectStyle, setProjectStyle] = useState({
    position: "relative",
    top: "-400px",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [showScene, setShowScene] = useState(true);

  useEffect(() => {
    const updateStyle = () => {
      if (window.innerWidth <= 768) {
        setProjectStyle({ position: "relative", top: "-150px" });
      } else {
        setProjectStyle({ position: "relative", top: "-400px" });
      }
    };

    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 500);
    };

    window.addEventListener("resize", updateStyle);
    //window.addEventListener("scroll", toggleVisibility);

    updateStyle();

    return () => {
      window.removeEventListener("resize", updateStyle);
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    smoothScroll.scrollToTop();
  };

  const scrollToContact = () => {
    smoothScroll.scrollTo(contactRef.current.offsetTop);
  };

  const homeStyle = {
    position: "relative",
    zIndex: 1,
  };

  const fullScreenSection = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "transparent",
    textAlign: "center",
    color: "#fff",
  };

  const pixelatedStyle = {
    maxWidth: "80%",
    height: "auto",
    imageRendering: "pixelated",
    transition: "opacity 2s ease",
    opacity: 0,
  };

  const handleImageLoad = (event) => {
    event.target.style.opacity = 1;
  };

  // Disable scrolling and hide scrollbar initially
  useEffect(() => {
    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.body.style.overflowY = "hidden";
    document.body.style.overflowX = "hidden";
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    const timer = setTimeout(() => {
      if (threeBackground2Ref.current) {
        smoothScroll.gsap
          .to(threeBackground2Ref.current, {
            opacity: 0,
            duration: 3.5,
            ease: "power2.inOut",
          })
          .then(() => {
            setTimeout(() => {
              setShowScene(false);
            }, 3500);
          });
      }

      // Re-enable scrolling and show scrollbar after 10 seconds
      //document.body.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    }, 10000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, []);

   // Disable scrolling and hide scrollbar permanently
   useEffect(() => {
    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.body.style.overflow = "hidden";  // Ensure scrollbar stays hidden
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      document.body.style.overflowY = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

   // Automatically scroll down the page slowly
   useEffect(() => {
    const scrollStep = () => {
      window.scrollBy(0, 0); // Adjust the second parameter for the scroll speed
    };
    const intervalId = setInterval(scrollStep, 50); // Adjust the interval for the scroll speed

    return () => {
      clearInterval(intervalId);
    };
  }, []);


  return (
    <div className="home-1" style={homeStyle}>
      {showScene && (
        <div
          ref={threeBackground2Ref}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999999,
            opacity: 1,
            transition: "opacity 2s ease",
            overflow: "hidden", // Ensure the background does not scroll
            pointerEvents: "none", // Prevent interaction
          }}
        >
          <ThreeBackground2
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}
      <section style={fullScreenSection}></section>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          overflow: "hidden", // Ensure the background does not scroll
          pointerEvents: "none", // Prevent interaction
        }}
      >
        <ThreeBackground
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <Slider data={dataSlider} />

      <About data={dataAbout} style={{ position: "relative", top: "-150px" }} />
      <div>
        <PageTitle title="Contact " />

        <section className="tf-section tf-contact">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div
                  className="content-about m-b50 mobie-40"
                  data-aos="fade-right"
                  data-aos-duration="800"
                >
                  <div className="tf-title st2 m-b17">
                    <h4 className="title"></h4>
                  </div>
                  <p className="m-r-40"></p>
                </div>
                <form
                  action="contact/contact-process.php"
                  className="form-contact"
                  id="contactform"
                  data-aos="fade-right"
                  data-aos-duration="800"
                >
                  <fieldset>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Name"
                    />
                  </fieldset>
                  <fieldset>
                    <input
                      type="email"
                      name="mail"
                      id="mail"
                      placeholder="Email Address"
                    />
                  </fieldset>
                  <fieldset>
                    <input
                      type="number"
                      name="phone"
                      id="phone"
                      placeholder="Phone"
                    />
                  </fieldset>
                  <fieldset>
                    <textarea
                      placeholder="Type your Message"
                      rows="5"
                      tabIndex="4"
                      name="message"
                      className="message"
                      id="message"
                    ></textarea>
                  </fieldset>
                  <button
                    className="tf-button btn-effect"
                    type="submit"
                    style={{ display: "block", margin: "0 auto" }}
                  >
                    <span className="boder-fade"></span>
                    <span className="effect">Send Message</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ScrollText />

      <footer id="footer">
        <div className="footer-main">
          <img src={img1} alt="" className="bg1" />
          <img src={img2} alt="" className="bg2" />
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="wrap-fx">
              <div className="Copyright">
                <p></p>
              </div>
            </div>
          </div>
        </div>

        {isVisible && (
          <Link onClick={scrollToTop} to="#" id="scroll-top"></Link>
        )}
      </footer>
    </div>
  );
}

export default HomeOne;
