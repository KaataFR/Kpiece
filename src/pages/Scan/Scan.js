import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Scan.css";
import scans from "./../../assets/data/scans.json";
import ost from "./../../assets/mp3/ost.mp3";

function Scan() {
  const navigate = useNavigate();
  const { scan: scanParam } = useParams();
  const scan = scans.find((s) => s.scan === scanParam);
  const totalPages = scan ? scan.maxpages : 0;
  const imageContainerRef = useRef(null);

  const [imageIndex, setImageIndex] = useState(1);
  const [imageUrl, setImageUrl] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Valeur initiale du volume (0.5 = 50%)
  

  const audioRef = useRef(null);



    useEffect(() => {
      const preloadImage = (url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        });
      };
    
      const preloadScanImages = async () => {
        const scanImages = scans
          .filter((s) => s.scan === scanParam) // Filtrer les scans pour obtenir celui en cours
          .flatMap((scan) => {
            const totalPages = scan.maxpages;
            return Array.from(
              { length: totalPages },
              (_, index) => `${scan.pages}${String(index + 1).padStart(2, "0")}.png`
            );
          });
    
        const preloadedImages = [];
    
        for (const imageUrl of scanImages) {
          try {
            await preloadImage(imageUrl);
            preloadedImages.push(imageUrl);
          } catch (error) {
            console.error(`Failed to preload image: ${imageUrl}`);
          }
        }
    
        console.log("Scan images preloaded:", preloadedImages);
      };
    
      preloadScanImages();
    }, [scanParam]);
    

  const handleMusicButtonClick = () => {
    if (isMusicPlaying) {
      audioRef.current.pause(); // Mettre la musique en pause
    } else {
      audioRef.current.play(); // Lire la musique
    }
    setIsMusicPlaying((prevIsMusicPlaying) => !prevIsMusicPlaying); // Inverser l'état de la musique
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume; // Mettre à jour le volume de l'audio
  };

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

  const handlePreviousPage = () => {
    setImageIndex((prevIndex) => Math.max(prevIndex - 1, 1));
  };

  const handleNextPage = () => {
    if (imageIndex < totalPages) {
      setImageIndex((prevIndex) => prevIndex + 1);
      window.scrollTo(0, 0); // Scroll to the top of the page
    }
  };

  useEffect(() => {
    const handleAudioEnded = () => {
      setIsMusicPlaying(false);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleAudioEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioEnded);
      }
    };
  }, []);

  const imageIndexRef = useRef(imageIndex);

  useEffect(() => {
    imageIndexRef.current = imageIndex;
  }, [imageIndex]);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      // Left arrow key
      handlePreviousPage();
    } else if (event.key === "ArrowRight") {
      // Right arrow key
      if (imageIndexRef.current < totalPages) {
        handleNextPage();
      } else {
        event.preventDefault(); // Bloquer la touche lorsque imageIndex atteint la valeur de totalPages
      }
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
    document.addEventListener("keydown", handleKeyDown);

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
      document.removeEventListener("keydown", handleKeyDown);
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

      <div className="Scan-content">
        <div className="Scan-navbar">
          <button onClick={handlePreviousPage}>
            <i className="fa-solid fa-circle-arrow-left"></i>
          </button>
          <button onClick={handleNextPage}>
            <i className="fa-solid fa-circle-arrow-right"></i>
          </button>
          <button className="Scan-full" onClick={handleFullScreen}>
            <i className="fa-solid fa-expand"></i>
          </button>         
          <button className="Scan-music" onClick={handleMusicButtonClick}>
            <i className="fa-solid fa-music"></i>
          </button>
          <button className="Scan-volume" onClick={handleVolumeChange}>
            
            {volume === 0 ? (
              <i className="fa-solid fa-volume-mute"></i>
            ) : (
              <i className="fa-solid fa-volume"></i>
            )}
          </button>
          <input
            className="Scan-volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />

          <audio ref={audioRef} src={ost} loop></audio>
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
