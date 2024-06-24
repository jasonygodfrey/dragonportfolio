import React, { useRef, useEffect } from "react";
import ThreeBackground from "../components/ThreeBackground"; // Ensure this is the correct path

function HomeOne(props) {
  const threeBackgroundRef = useRef(null);

  useEffect(() => {
    // Prevent scrolling and hide scrollbar
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
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}>
      <div className="logo" style={{ position: "absolute", top: "50px", left: "50%", transform: "translateX(-50%)", zIndex: 10, pointerEvents: "none" }}>
        <img src="/logo.png" alt="logo" style={{ width: '254px', height: '64px', maxWidth: '100%', height: 'auto' }} />
      </div>
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
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        
        <a
          href="https://samuraistudios.dev"
          target="_blank"
          rel="noreferrer"
          style={{
            textAlign: "center",
            marginBottom: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50px",
            padding: "0 15px",
            backgroundColor: "transparent",
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            transition: "color 0.3s, text-shadow 0.3s"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = "#FFD700"; // Gold color on hover
            e.currentTarget.style.textShadow = "0 0 8px rgba(255,215,0,0.8)"; // Brighter shadow on hover
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "white";
            e.currentTarget.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";
          }}
        >
          
        </a>
        <a
          href="https://github.com/jasonygodfrey"
          target="_blank"
          rel="noreferrer"
          style={{
            textAlign: "center",
            marginBottom: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50px",
            padding: "0 15px",
            backgroundColor: "transparent",
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            transition: "color 0.3s, text-shadow 0.3s"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = "#FFD700"; // Gold color on hover
            e.currentTarget.style.textShadow = "0 0 8px rgba(255,215,0,0.8)"; // Brighter shadow on hover
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "white";
            e.currentTarget.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";
          }}
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/jasong7"
          target="_blank"
          rel="noreferrer"
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50px",
            padding: "0 15px",
            backgroundColor: "transparent",
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            transition: "color 0.3s, text-shadow 0.3s"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = "#FFD700"; // Gold color on hover
            e.currentTarget.style.textShadow = "0 0 8px rgba(255,215,0,0.8)"; // Brighter shadow on hover
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "white";
            e.currentTarget.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";
          }}
        >
          LinkedIn Contact
        </a>
      </div>
    </div>
  );
}

export default HomeOne;