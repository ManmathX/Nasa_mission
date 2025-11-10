import React from 'react';
import { motion } from 'framer-motion';
import PlanetVisualizer from '../components/PlanetVisualizer';
import './PlanetVisualizerPage.css';

const PlanetVisualizerPage = () => {
  return (
    <div className="planet-visualizer-page">
      <motion.div
        className="visualizer-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="page-title">
          <span className="gradient-text">Planet Visualizer</span>
        </h1>
        <p className="page-description">
          Explore the solar system and exoplanets in an interactive 3D environment
        </p>
      </motion.div>
      
      <motion.div
        className="visualizer-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <PlanetVisualizer />
      </motion.div>
    </div>
  );
};

export default PlanetVisualizerPage;
