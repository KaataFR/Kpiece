import React, { useState, useEffect,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Scan.css";
import scans from "./../../assets/data/scans.json";

function Scan() {
  const navigate = useNavigate();
  const { scan: scanParam } = useParams();
  const scan = scans.find((s) => s.scan === scanParam);
  const totalPages = scan ? scan.maxpages : 0;
  const imageContainerRef = useRef(null);

  const [imageIndex, setImageIndex] = useState(1);
  const [imageUrl, setImageUrl] = useState("");
  const [fullscreen, setFullscreen] = useState(false);

  const [scale, setScale] = useState(1);


  

  useEffect(() => {
    if (scan) {
      setImageUrl(`${scan.pages}${String(imageIndex).padStart(2, "0")}.png`);
    }
  }, [scan, imageIndex]);

  useEffect(() => {
    const selectedScan = scanParam || scans[0].scan;
    const selectedScanIndex = scans.findIndex((s) => s.scan === selectedScan);
    if (selectedScanIndex !== -1) {
      setImageIndex(selectedScanIndex + 1);
    }
  }, [scanParam, scans]);

  useEffect(() => {
    if (scan) {
      setImageIndex(1);
    }
  }, [scan]);






  const handleSelectChange = (event) => {
    const selectedScan = event.target.value;
    navigate(`/scans/${selectedScan}`);
  };



  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 1));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.8));
  };

  const handlePreviousPage = () => {
    setImageIndex((prevIndex) => Math.max(prevIndex - 1, 1));
  };

  const handleNextPage = () => {
    if (imageIndex < totalPages) {
      setImageIndex((prevIndex) => prevIndex + 1);
      window.scrollTo(0, 0); // Scroll to the top of the page
    }
  };
  
  

  const handleFullScreen = () => {
    if (!fullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <div className={`Scan ${fullscreen ? "fullscreen" : ""}`}>


      <select className="Scan-select" onChange={handleSelectChange}>
        {scans.map((s) => (
          <option key={s.scan} value={s.scan}>
            {`${s.scan} - ${s.title}`}
          </option>
        ))}
      </select>

<p>{`${imageIndex}/${totalPages}`}</p>

      <div className="Scan-content" style={{ transform: `scale(${scale})` }}>
        <div className="Scan-navbar">
          <button onClick={handleZoomIn} className="zoom-button">
            <i className="fa-solid fa-magnifying-glass-plus"></i>
          </button>
          <button onClick={handleZoomOut} className="zoom-button">
            <i className="fa-solid fa-magnifying-glass-minus"></i>
          </button>
          <button onClick={handlePreviousPage}>
            <i className="fa-solid fa-circle-arrow-left"></i>
          </button>
          <button onClick={handleNextPage}>
            <i className="fa-solid fa-circle-arrow-right"></i>
          </button>
          <button onClick={handleFullScreen}>
            <i className="fa-solid fa-expand"></i>
          </button>
        </div>

        {scan && imageUrl && (
        <div className="Scan-images">
          <div className="Scan-image-container" ref={imageContainerRef}>
              <div
                className={`Scan-image-overlay custom-left-side ${
                  imageIndex === 1 ? "inactive" : ""
                }`}
                onClick={handlePreviousPage}
              ></div>
              <div
                className={`Scan-image-overlay custom-right-side ${
                  imageIndex === totalPages ? "inactive" : ""
                }`}
                onClick={handleNextPage}
              ></div>
              <img
                className="Scan-image"
                src={imageUrl}
                alt={`Page ${imageIndex}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Scan;
