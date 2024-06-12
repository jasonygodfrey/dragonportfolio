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
  );
}

export default HomeOne;
