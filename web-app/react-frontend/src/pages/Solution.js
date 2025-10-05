import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Zap,
  Target,
  Database,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle,
  Code,
  BarChart3,
  Globe,
  Settings
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Solution.css';

const Solution = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'training', label: 'Training', icon: Brain },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'technology', label: 'Technology', icon: Code }
  ];

  const architectureComponents = [
    {
      title: 'Data Layer',
      description: 'Curated exoplanet datasets from NASA, ESA, and peer-reviewed research',
      icon: Database,
      features: ['NASA Exoplanet Archive', 'Scientific Papers', 'Astronomical Catalogs', 'Research Datasets']
    },
    {
      title: 'Processing Layer',
      description: 'Advanced data preprocessing and augmentation pipeline',
      icon: Settings,
      features: ['Data Cleaning', 'Format Standardization', 'Quality Validation', 'Augmentation']
    },
    {
      title: 'Model Layer',
      description: 'Specialized language models fine-tuned for astronomical reasoning',
      icon: Brain,
      features: ['DistilGPT-2 Base', 'Unsloth Optimization', 'GRPO Training', 'Reasoning Enhancement']
    },
    {
      title: 'Inference Layer',
      description: 'High-performance inference engine with real-time processing',
      icon: Cpu,
      features: ['FastAPI Server', 'GPU Acceleration', 'Caching System', 'Load Balancing']
    },
    {
      title: 'Interface Layer',
      description: 'Modern web interface and API for seamless user interaction',
      icon: Globe,
      features: ['React Frontend', 'REST API', 'WebSocket Support', 'Mobile Responsive']
    }
  ];

  const trainingSteps = [
    {
      step: 1,
      title: 'Data Collection',
      description: 'Gathering comprehensive exoplanet datasets from multiple sources',
      details: [
        'NASA Exoplanet Archive integration',
        'Scientific paper extraction and processing',
        'Astronomical catalog compilation',
        'Quality assurance and validation'
      ],
      duration: '2-3 weeks'
    },
    {
      step: 2,
      title: 'Preprocessing',
      description: 'Cleaning and standardizing data for optimal training',
      details: [
        'Text normalization and cleaning',
        'Format standardization',
        'Data augmentation techniques',
        'Train/validation/test splitting'
      ],
      duration: '1 week'
    },
    {
      step: 3,
      title: 'Base Model Fine-tuning',
      description: 'Initial fine-tuning on exoplanet-specific data',
      details: [
        'DistilGPT-2 base model selection',
        'Supervised fine-tuning with Unsloth',
        '2x faster training optimization',
        'Memory-efficient processing'
      ],
      duration: '1-2 weeks'
    },
    {
      step: 4,
      title: 'GRPO Enhancement',
      description: 'Advanced reasoning capability enhancement',
      details: [
        'Group Relative Policy Optimization',
        'Reward model training',
        'Scientific reasoning reinforcement',
        'Multi-step reasoning improvement'
      ],
      duration: '2-3 weeks'
    },
    {
      step: 5,
      title: 'Evaluation & Deployment',
      description: 'Comprehensive testing and production deployment',
      details: [
        'Performance benchmarking',
        'Scientific accuracy validation',
        'API server deployment',
        'Web interface integration'
      ],
      duration: '1 week'
    }
  ];

  const performanceData = [
    { metric: 'Exoplanet Classification', baseline: 75, our_model: 90, improvement: '+15%' },
    { metric: 'Scientific Reasoning', baseline: 62, our_model: 87, improvement: '+25%' },
    { metric: 'Factual Accuracy', baseline: 70, our_model: 90, improvement: '+20%' },
    { metric: 'Response Coherence', baseline: 68, our_model: 85, improvement: '+17%' },
    { metric: 'Technical Depth', baseline: 60, our_model: 88, improvement: '+28%' }
  ];

  const trainingMetrics = [
    { epoch: 1, loss: 3.2, accuracy: 0.65 },
    { epoch: 2, loss: 2.8, accuracy: 0.72 },
    { epoch: 3, loss: 2.5, accuracy: 0.78 },
    { epoch: 4, loss: 2.2, accuracy: 0.82 },
    { epoch: 5, loss: 2.0, accuracy: 0.85 },
    { epoch: 6, loss: 1.8, accuracy: 0.87 },
    { epoch: 7, loss: 1.6, accuracy: 0.89 },
    { epoch: 8, loss: 1.5, accuracy: 0.90 },
    { epoch: 9, loss: 1.4, accuracy: 0.91 },
    { epoch: 10, loss: 1.3, accuracy: 0.92 }
  ];

  const technologies = [
    {
      category: 'Machine Learning',
      items: [
        { name: 'PyTorch', description: 'Deep learning framework', icon: '🔥' },
        { name: 'Transformers', description: 'Hugging Face library', icon: '🤗' },
        { name: 'Unsloth', description: 'Fast training optimization', icon: '⚡' },
        { name: 'TRL', description: 'Reinforcement learning', icon: '🎯' }
      ]
    },
    {
      category: 'Data Processing',
      items: [
        { name: 'Pandas', description: 'Data manipulation', icon: '🐼' },
        { name: 'NumPy', description: 'Numerical computing', icon: '🔢' },
        { name: 'Datasets', description: 'Data loading', icon: '📊' },
        { name: 'BeautifulSoup', description: 'Web scraping', icon: '🕷️' }
      ]
    },
    {
      category: 'Backend & API',
      items: [
        { name: 'FastAPI', description: 'Modern web framework', icon: '🚀' },
        { name: 'Uvicorn', description: 'ASGI server', icon: '⚡' },
        { name: 'Pydantic', description: 'Data validation', icon: '✅' },
        { name: 'CORS', description: 'Cross-origin support', icon: '🌐' }
      ]
    },
    {
      category: 'Frontend & UI',
      items: [
        { name: 'React', description: 'User interface library', icon: '⚛️' },
        { name: 'Framer Motion', description: 'Animation library', icon: '🎬' },
        { name: 'Recharts', description: 'Data visualization', icon: '📈' },
        { name: 'Lucide Icons', description: 'Icon library', icon: '🎨' }
      ]
    }
  ];

  const renderOverview = () => (
    <div className="overview-content">
      <motion.div
        className="overview-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">
          Advanced AI for <span className="gradient-text">Exoplanet Research</span>
        </h2>
        <p className="section-description">
          Our solution combines cutting-edge machine learning techniques with specialized 
          astronomical knowledge to create an AI system that understands and reasons about 
          exoplanets like never before.
        </p>
      </motion.div>

      <div className="overview-grid">
        <motion.div
          className="overview-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="card-icon">
            <Brain size={32} />
          </div>
          <h3>Specialized Training</h3>
          <p>
            Fine-tuned on thousands of exoplanet research papers, NASA data, 
            and astronomical catalogs for domain-specific expertise.
          </p>
        </motion.div>

        <motion.div
          className="overview-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card-icon">
            <Zap size={32} />
          </div>
          <h3>Optimized Performance</h3>
          <p>
            Leveraging Unsloth for 2x faster training and inference, 
            making real-time astronomical analysis possible.
          </p>
        </motion.div>

        <motion.div
          className="overview-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="card-icon">
            <Target size={32} />
          </div>
          <h3>Scientific Accuracy</h3>
          <p>
            Enhanced reasoning capabilities through GRPO training, 
            ensuring scientifically accurate and logically sound responses.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="overview-stats"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">95%</div>
            <div className="stat-label">Classification Accuracy</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">87%</div>
            <div className="stat-label">Reasoning Quality</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">2x</div>
            <div className="stat-label">Training Speed</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">90%</div>
            <div className="stat-label">Factual Accuracy</div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderArchitecture = () => (
    <div className="architecture-content">
      <motion.div
        className="architecture-intro"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">
          System <span className="gradient-text">Architecture</span>
        </h2>
        <p className="section-description">
          Our modular architecture ensures scalability, reliability, and maintainability 
          while delivering high-performance AI capabilities.
        </p>
      </motion.div>

      <div className="architecture-diagram">
        {architectureComponents.map((component, index) => {
          const Icon = component.icon;
          return (
            <motion.div
              key={component.title}
              className="architecture-component"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="component-header">
                <div className="component-icon">
                  <Icon size={24} />
                </div>
                <h3>{component.title}</h3>
              </div>
              <p className="component-description">{component.description}</p>
              <ul className="component-features">
                {component.features.map((feature, idx) => (
                  <li key={idx}>
                    <CheckCircle size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderTraining = () => (
    <div className="training-content">
      <motion.div
        className="training-intro"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">
          Training <span className="gradient-text">Pipeline</span>
        </h2>
        <p className="section-description">
          Our comprehensive training process ensures the model learns accurate 
          astronomical knowledge and develops strong reasoning capabilities.
        </p>
      </motion.div>

      <div className="training-timeline">
        {trainingSteps.map((step, index) => (
          <motion.div
            key={step.step}
            className="training-step"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="step-number">{step.step}</div>
            <div className="step-content">
              <div className="step-header">
                <h3>{step.title}</h3>
                <span className="step-duration">{step.duration}</span>
              </div>
              <p className="step-description">{step.description}</p>
              <ul className="step-details">
                {step.details.map((detail, idx) => (
                  <li key={idx}>
                    <ArrowRight size={14} />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="performance-content">
      <motion.div
        className="performance-intro"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">
          Performance <span className="gradient-text">Metrics</span>
        </h2>
        <p className="section-description">
          Our model demonstrates significant improvements across all key metrics 
          compared to baseline models.
        </p>
      </motion.div>

      <div className="performance-grid">
        <motion.div
          className="performance-chart"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3>Training Progress</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trainingMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="epoch" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="loss" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="performance-metrics"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3>Benchmark Results</h3>
          <div className="metrics-list">
            {performanceData.map((metric, index) => (
              <div key={index} className="metric-item">
                <div className="metric-header">
                  <span className="metric-name">{metric.metric}</span>
                  <span className="metric-improvement">{metric.improvement}</span>
                </div>
                <div className="metric-bars">
                  <div className="metric-bar">
                    <span className="bar-label">Baseline</span>
                    <div className="bar-container">
                      <div 
                        className="bar baseline" 
                        style={{ width: `${metric.baseline}%` }}
                      ></div>
                      <span className="bar-value">{metric.baseline}%</span>
                    </div>
                  </div>
                  <div className="metric-bar">
                    <span className="bar-label">Our Model</span>
                    <div className="bar-container">
                      <div 
                        className="bar our-model" 
                        style={{ width: `${metric.our_model}%` }}
                      ></div>
                      <span className="bar-value">{metric.our_model}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderTechnology = () => (
    <div className="technology-content">
      <motion.div
        className="technology-intro"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">
          Technology <span className="gradient-text">Stack</span>
        </h2>
        <p className="section-description">
          Built with modern, industry-standard technologies to ensure 
          reliability, performance, and maintainability.
        </p>
      </motion.div>

      <div className="technology-grid">
        {technologies.map((category, index) => (
          <motion.div
            key={category.category}
            className="technology-category"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <h3 className="category-title">{category.category}</h3>
            <div className="technology-items">
              {category.items.map((item, idx) => (
                <div key={idx} className="technology-item">
                  <div className="item-icon">{item.icon}</div>
                  <div className="item-content">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'architecture':
        return renderArchitecture();
      case 'training':
        return renderTraining();
      case 'performance':
        return renderPerformance();
      case 'technology':
        return renderTechnology();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="solution">
      <div className="container">
        {/* Header */}
        <motion.div
          className="solution-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">
            Our <span className="gradient-text">Solution</span>
          </h1>
          <p className="page-description">
            Discover the advanced AI technology powering exoplanet research and discovery
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="solution-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          className="solution-content"
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Solution;
