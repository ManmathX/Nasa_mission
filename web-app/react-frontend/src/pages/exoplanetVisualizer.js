import React from 'react';
import './exoplanetVisualizer.css';

const ExoplanetVisualizer = () => {
  return (
    <div className="exoplanet-visualizer-container">
      <div className="visualizer-header">
        <h1 className="visualizer-title">
          <span className="gradient-text">Exoplanet Visualizer</span>
        </h1>
        <p className="visualizer-subtitle">
          Explore habitable exoplanets in an interactive 3D environment
        </p>
        <div className="visualizer-info">
          <div className="info-badge">
            <span className="badge-icon">🌍</span>
            <span className="badge-text">Habitable Zone Explorer</span>
          </div>
          <div className="info-badge">
            <span className="badge-icon">🔭</span>
            <span className="badge-text">Real NASA Data</span>
          </div>
          <div className="info-badge">
            <span className="badge-icon">🎮</span>
            <span className="badge-text">Interactive 3D</span>
          </div>
        </div>
      </div>

      <div className="iframe-wrapper">
        <iframe
          src="https://www.exoplanetvisualizer.com/habitable"
          title="Exoplanet Visualizer - Habitable Planets"
          className="visualizer-iframe"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <div className="visualizer-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About This Visualizer</h3>
            <p>
              This interactive tool allows you to explore potentially habitable exoplanets 
              discovered by NASA missions like Kepler, TESS, and others. Navigate through 
              3D space to see where these worlds are located relative to Earth.
            </p>
          </div>
          <div className="footer-section">
            <h3>How to Use</h3>
            <ul>
              <li>🖱️ Click and drag to rotate the view</li>
              <li>🔍 Scroll to zoom in/out</li>
              <li>🎯 Click on planets to see detailed information</li>
              <li>🌟 Filter by habitability criteria</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Data Source</h3>
            <p>
              Powered by <strong>exoplanetvisualizer.com</strong> using data from:
            </p>
            <ul>
              <li>NASA Exoplanet Archive</li>
              <li>Kepler Mission</li>
              <li>TESS Mission</li>
              <li>ESA Gaia Mission</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExoplanetVisualizer;
