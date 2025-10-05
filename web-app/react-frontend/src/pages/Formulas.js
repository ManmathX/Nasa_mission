import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Star,
  Globe,
  Zap,
  Target,
  Search,
  Copy,
  Check,
  Lightbulb,
  Info,
  AlertCircle
} from 'lucide-react';
import './Formulas.css';

const Formulas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedFormula, setCopiedFormula] = useState(null);

  const categories = [
    { id: 'all', label: 'All Formulas', icon: Calculator },
    { id: 'detection', label: 'Detection Methods', icon: Target },
    { id: 'habitable', label: 'Habitable Zones', icon: Globe },
    { id: 'orbital', label: 'Orbital Mechanics', icon: Star },
    { id: 'atmospheric', label: 'Atmospheric Analysis', icon: Zap }
  ];

  const formulas = [
    {
      id: 1,
      title: 'Transit Method Depth',
      category: 'detection',
      description: 'Calculates the depth of a planetary transit based on stellar and planetary properties',
      formula: 'δ = (Rp/Rs)²',
      variables: [
        { symbol: 'δ', name: 'Transit Depth', unit: 'dimensionless' },
        { symbol: 'Rp', name: 'Planet Radius', unit: 'R⊕' },
        { symbol: 'Rs', name: 'Star Radius', unit: 'R☉' }
      ],
      explanation: 'The transit depth represents the fractional decrease in stellar brightness when a planet passes in front of its star. This is the fundamental observable in transit photometry.',
      applications: ['Exoplanet detection', 'Planet size estimation', 'Transit light curve analysis'],
      difficulty: 'beginner'
    },
    {
      id: 2,
      title: 'Radial Velocity Semi-Amplitude',
      category: 'detection',
      description: 'Determines the stellar velocity variation caused by an orbiting planet',
      formula: 'K = (2πG/P)^(1/3) × (Mp sin i)/(Mp + Ms)^(2/3)',
      variables: [
        { symbol: 'K', name: 'Semi-amplitude', unit: 'm/s' },
        { symbol: 'G', name: 'Gravitational constant', unit: 'm³/kg⋅s²' },
        { symbol: 'P', name: 'Orbital period', unit: 'days' },
        { symbol: 'Mp', name: 'Planet mass', unit: 'M⊕' },
        { symbol: 'Ms', name: 'Star mass', unit: 'M☉' },
        { symbol: 'i', name: 'Orbital inclination', unit: 'degrees' }
      ],
      explanation: 'This formula relates the observed radial velocity variation to the planet mass and orbital parameters. The sin i term means we can only determine the minimum mass.',
      applications: ['Planet mass estimation', 'Orbital parameter determination', 'Multi-planet system analysis'],
      difficulty: 'intermediate'
    },
    {
      id: 3,
      title: 'Habitable Zone Distance',
      category: 'habitable',
      description: 'Calculates the distance range where liquid water can exist on a planet surface',
      formula: 'd = √(L/L☉) × (1 - A)^(1/4)',
      variables: [
        { symbol: 'd', name: 'Distance from star', unit: 'AU' },
        { symbol: 'L', name: 'Stellar luminosity', unit: 'L☉' },
        { symbol: 'L☉', name: 'Solar luminosity', unit: 'L☉' },
        { symbol: 'A', name: 'Planetary albedo', unit: 'dimensionless' }
      ],
      explanation: 'The habitable zone distance depends on stellar luminosity and planetary albedo. This simplified formula assumes Earth-like atmospheric conditions.',
      applications: ['Habitable zone mapping', 'Exoplanet habitability assessment', 'Mission planning'],
      difficulty: 'beginner'
    },
    {
      id: 4,
      title: 'Kepler\'s Third Law',
      category: 'orbital',
      description: 'Relates orbital period to semi-major axis for planetary orbits',
      formula: 'P² = (4π²a³)/(G(Ms + Mp))',
      variables: [
        { symbol: 'P', name: 'Orbital period', unit: 'years' },
        { symbol: 'a', name: 'Semi-major axis', unit: 'AU' },
        { symbol: 'G', name: 'Gravitational constant', unit: 'AU³/M☉⋅yr²' },
        { symbol: 'Ms', name: 'Star mass', unit: 'M☉' },
        { symbol: 'Mp', name: 'Planet mass', unit: 'M☉' }
      ],
      explanation: 'This fundamental law of planetary motion allows us to determine orbital distances from observed periods, or vice versa.',
      applications: ['Orbital parameter calculation', 'System architecture analysis', 'Dynamical stability studies'],
      difficulty: 'beginner'
    },
    {
      id: 5,
      title: 'Atmospheric Scale Height',
      category: 'atmospheric',
      description: 'Determines the characteristic height of atmospheric density decrease',
      formula: 'H = kT/(μg)',
      variables: [
        { symbol: 'H', name: 'Scale height', unit: 'km' },
        { symbol: 'k', name: 'Boltzmann constant', unit: 'J/K' },
        { symbol: 'T', name: 'Atmospheric temperature', unit: 'K' },
        { symbol: 'μ', name: 'Mean molecular weight', unit: 'kg/mol' },
        { symbol: 'g', name: 'Surface gravity', unit: 'm/s²' }
      ],
      explanation: 'Scale height determines how quickly atmospheric density decreases with altitude, crucial for atmospheric modeling and transmission spectroscopy.',
      applications: ['Atmospheric modeling', 'Transmission spectroscopy', 'Climate studies'],
      difficulty: 'intermediate'
    },
    {
      id: 6,
      title: 'Planet-Planet Gravitational Interaction',
      category: 'orbital',
      description: 'Calculates gravitational forces between planets in multi-planet systems',
      formula: 'F = G × (M1 × M2)/r²',
      variables: [
        { symbol: 'F', name: 'Gravitational force', unit: 'N' },
        { symbol: 'G', name: 'Gravitational constant', unit: 'm³/kg⋅s²' },
        { symbol: 'M1, M2', name: 'Planet masses', unit: 'kg' },
        { symbol: 'r', name: 'Distance between planets', unit: 'm' }
      ],
      explanation: 'This Newtonian gravity formula is essential for understanding planetary dynamics and orbital stability in multi-planet systems.',
      applications: ['Dynamical stability analysis', 'Orbital evolution modeling', 'Resonance studies'],
      difficulty: 'intermediate'
    },
    {
      id: 7,
      title: 'Transit Duration',
      category: 'detection',
      description: 'Calculates the duration of a planetary transit',
      formula: 'T = (P/π) × arcsin(√((Rs + Rp)² - (a cos i)²)/a)',
      variables: [
        { symbol: 'T', name: 'Transit duration', unit: 'hours' },
        { symbol: 'P', name: 'Orbital period', unit: 'days' },
        { symbol: 'Rs', name: 'Star radius', unit: 'R☉' },
        { symbol: 'Rp', name: 'Planet radius', unit: 'R⊕' },
        { symbol: 'a', name: 'Semi-major axis', unit: 'AU' },
        { symbol: 'i', name: 'Orbital inclination', unit: 'degrees' }
      ],
      explanation: 'Transit duration depends on orbital geometry and stellar/planetary sizes. This formula assumes circular orbits.',
      applications: ['Transit timing analysis', 'Orbital parameter estimation', 'System architecture studies'],
      difficulty: 'advanced'
    },
    {
      id: 8,
      title: 'Roche Limit',
      category: 'orbital',
      description: 'Determines the minimum distance a planet can orbit without being torn apart by tidal forces',
      formula: 'd = 2.456 × R × (ρp/ρs)^(1/3)',
      variables: [
        { symbol: 'd', name: 'Roche limit', unit: 'km' },
        { symbol: 'R', name: 'Planet radius', unit: 'km' },
        { symbol: 'ρp', name: 'Planet density', unit: 'kg/m³' },
        { symbol: 'ρs', name: 'Star density', unit: 'kg/m³' }
      ],
      explanation: 'The Roche limit defines the closest stable orbital distance. Inside this limit, tidal forces exceed the planet\'s self-gravity.',
      applications: ['Planet survival analysis', 'Tidal evolution studies', 'Roche lobe overflow'],
      difficulty: 'intermediate'
    }
  ];

  const filteredFormulas = formulas.filter(formula => {
    const matchesSearch = formula.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.formula.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || formula.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = async (formula) => {
    try {
      await navigator.clipboard.writeText(formula);
      setCopiedFormula(formula);
      setTimeout(() => setCopiedFormula(null), 2000);
    } catch (error) {
      console.error('Failed to copy formula:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return 'Unknown';
    }
  };

  return (
    <div className="formulas">
      <div className="container">
        {/* Header */}
        <motion.div
          className="formulas-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">
            Astronomical <span className="gradient-text">Formulas</span>
          </h1>
          <p className="page-description">
            Essential mathematical equations and formulas used in exoplanet research and analysis
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="formulas-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search formulas, variables, or applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon size={18} />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Formulas Grid */}
        <div className="formulas-grid">
          <AnimatePresence>
            {filteredFormulas.map((formula, index) => (
              <motion.div
                key={formula.id}
                className="formula-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                layout
              >
                <div className="formula-header">
                  <div className="formula-title-section">
                    <h3 className="formula-title">{formula.title}</h3>
                    <div className="formula-meta">
                      <span 
                        className="difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(formula.difficulty) }}
                      >
                        {getDifficultyLabel(formula.difficulty)}
                      </span>
                      <span className="category-badge">{formula.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(formula.formula)}
                    className="copy-button"
                    title="Copy formula"
                  >
                    {copiedFormula === formula.formula ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>

                <p className="formula-description">{formula.description}</p>

                <div className="formula-display">
                  <div className="formula-text">{formula.formula}</div>
                </div>

                <div className="formula-variables">
                  <h4>Variables</h4>
                  <div className="variables-list">
                    {formula.variables.map((variable, idx) => (
                      <div key={idx} className="variable-item">
                        <span className="variable-symbol">{variable.symbol}</span>
                        <span className="variable-name">{variable.name}</span>
                        <span className="variable-unit">({variable.unit})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="formula-explanation">
                  <h4>
                    <Info size={16} />
                    Explanation
                  </h4>
                  <p>{formula.explanation}</p>
                </div>

                <div className="formula-applications">
                  <h4>
                    <Lightbulb size={16} />
                    Applications
                  </h4>
                  <div className="applications-list">
                    {formula.applications.map((application, idx) => (
                      <span key={idx} className="application-tag">
                        {application}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredFormulas.length === 0 && (
          <motion.div
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AlertCircle size={48} />
            <h3>No formulas found</h3>
            <p>Try adjusting your search terms or category filter</p>
          </motion.div>
        )}

        {/* Quick Reference */}
        <motion.div
          className="quick-reference"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>Quick Reference</h2>
          <div className="reference-grid">
            <div className="reference-card">
              <Calculator size={24} />
              <h3>Common Constants</h3>
              <ul>
                <li>G = 6.674 × 10⁻¹¹ m³/kg⋅s²</li>
                <li>R☉ = 6.96 × 10⁸ m</li>
                <li>M☉ = 1.99 × 10³⁰ kg</li>
                <li>L☉ = 3.83 × 10²⁶ W</li>
              </ul>
            </div>
            <div className="reference-card">
              <Star size={24} />
              <h3>Unit Conversions</h3>
              <ul>
                <li>1 AU = 1.496 × 10¹¹ m</li>
                <li>1 R⊕ = 6.371 × 10⁶ m</li>
                <li>1 M⊕ = 5.97 × 10²⁴ kg</li>
                <li>1 parsec = 3.086 × 10¹⁶ m</li>
              </ul>
            </div>
            <div className="reference-card">
              <Target size={24} />
              <h3>Detection Limits</h3>
              <ul>
                <li>Transit: δ > 0.1%</li>
                <li>RV: K > 1 m/s</li>
                <li>Direct imaging: Δm > 10</li>
                <li>Microlensing: θE > 0.1 mas</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Formulas;
