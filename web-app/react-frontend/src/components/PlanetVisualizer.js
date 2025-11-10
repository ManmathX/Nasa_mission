import React, { useEffect, useRef } from 'react';
import './PlanetVisualizer.css';

const PlanetVisualizer = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    // The iframe will load the PlanetVisualizer HTML file
    // You can add any initialization logic here if needed
  }, []);

  return (
    <div className="planet-visualizer-container">
      <iframe
        ref={iframeRef}
        src="/planet-visualizer/index.html"
        title="Planet Visualizer"
        className="planet-visualizer-iframe"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
};

export default PlanetVisualizer;
