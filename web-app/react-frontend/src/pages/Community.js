import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageCircle,
  Star,
  Plus,
  Search,
  Share2,
  Bookmark,
  Reply,
  Award,
  Github,
  User,
  Clock,
  Eye,
  ThumbsUp,
  MessageSquare,
  Target,
  BookOpen
} from 'lucide-react';
import './Community.css';

const Community = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'discussions', label: 'Discussions', icon: MessageCircle },
    { id: 'research', label: 'Research', icon: BookOpen },
    { id: 'questions', label: 'Q&A', icon: MessageSquare },
    { id: 'showcase', label: 'Showcase', icon: Star }
  ];

  const discussions = [
    {
      id: 1,
      title: 'New Exoplanet Discovery: TOI-715 b - A Super-Earth in the Habitable Zone',
      author: 'Dr. Sarah Chen',
      authorRole: 'Astrophysicist, MIT',
      avatar: 'SC',
      category: 'discovery',
      tags: ['habitable-zone', 'super-earth', 'transit-method'],
      content: 'Exciting news! The TESS mission has discovered TOI-715 b, a super-Earth orbiting a red dwarf star. This planet is particularly interesting because it lies within the conservative habitable zone...',
      likes: 42,
      replies: 18,
      views: 156,
      timeAgo: '2 hours ago',
      isPinned: true,
      isHot: true
    },
    {
      id: 2,
      title: 'Using Machine Learning for Exoplanet Atmospheric Analysis',
      author: 'Prof. Michael Rodriguez',
      authorRole: 'Planetary Scientist, NASA',
      avatar: 'MR',
      category: 'research',
      tags: ['machine-learning', 'atmospheric-analysis', 'jwst'],
      content: 'I\'ve been working on applying deep learning techniques to analyze JWST transmission spectra. The results are promising - we can now identify atmospheric constituents with higher accuracy...',
      likes: 28,
      replies: 12,
      views: 89,
      timeAgo: '5 hours ago',
      isPinned: false,
      isHot: false
    },
    {
      id: 3,
      title: 'Challenges in Detecting Earth-like Planets Around Sun-like Stars',
      author: 'Dr. Emily Watson',
      authorRole: 'Research Fellow, ESA',
      avatar: 'EW',
      category: 'discussion',
      tags: ['detection-methods', 'earth-analog', 'radial-velocity'],
      content: 'The search for Earth-like planets around Sun-like stars presents unique challenges. The transit method works best for close-in planets, while radial velocity can detect planets at larger distances...',
      likes: 35,
      replies: 24,
      views: 203,
      timeAgo: '1 day ago',
      isPinned: false,
      isHot: true
    },
    {
      id: 4,
      title: 'Building a DIY Spectrograph for Exoplanet Observations',
      author: 'Alex Thompson',
      authorRole: 'Amateur Astronomer',
      avatar: 'AT',
      category: 'showcase',
      tags: ['diy', 'spectroscopy', 'amateur-astronomy'],
      content: 'I\'ve been working on building a low-cost spectrograph for exoplanet observations. Here\'s my progress and some initial results from observing known exoplanet transits...',
      likes: 19,
      replies: 8,
      views: 67,
      timeAgo: '2 days ago',
      isPinned: false,
      isHot: false
    },
    {
      id: 5,
      title: 'The Future of Exoplanet Research: What to Expect in the Next Decade',
      author: 'Dr. James Liu',
      authorRole: 'Director, Exoplanet Institute',
      avatar: 'JL',
      category: 'discussion',
      tags: ['future-missions', 'technology', 'space-telescopes'],
      content: 'With upcoming missions like PLATO, ARIEL, and the next generation of ground-based telescopes, we\'re entering an exciting era of exoplanet research. Here\'s what I think we can expect...',
      likes: 51,
      replies: 31,
      views: 312,
      timeAgo: '3 days ago',
      isPinned: true,
      isHot: true
    }
  ];

  const researchPapers = [
    {
      id: 1,
      title: 'Atmospheric Characterization of Hot Jupiters Using Machine Learning',
      authors: ['Dr. Sarah Chen', 'Prof. Michael Rodriguez'],
      journal: 'Astrophysical Journal',
      year: 2024,
      doi: '10.3847/1538-4357/ad1234',
      abstract: 'We present a novel machine learning approach for characterizing exoplanet atmospheres using transmission spectroscopy data from JWST...',
      citations: 23,
      tags: ['machine-learning', 'atmospheric-analysis', 'hot-jupiters']
    },
    {
      id: 2,
      title: 'Detection of Water Vapor in the Atmosphere of K2-18b',
      authors: ['Dr. Emily Watson', 'Dr. James Liu'],
      journal: 'Nature Astronomy',
      year: 2024,
      doi: '10.1038/s41550-024-01234-5',
      abstract: 'Using JWST NIRSpec observations, we report the detection of water vapor in the atmosphere of the super-Earth K2-18b...',
      citations: 45,
      tags: ['water-vapor', 'jwst', 'super-earth']
    }
  ];

  const questions = [
    {
      id: 1,
      title: 'How do we determine the composition of exoplanet atmospheres?',
      author: 'Student Researcher',
      category: 'atmospheric-analysis',
      answers: 5,
      votes: 12,
      timeAgo: '4 hours ago',
      isAnswered: true
    },
    {
      id: 2,
      title: 'What is the difference between the conservative and optimistic habitable zone?',
      author: 'Amateur Astronomer',
      category: 'habitable-zones',
      answers: 3,
      votes: 8,
      timeAgo: '1 day ago',
      isAnswered: false
    },
    {
      id: 3,
      title: 'How accurate are current exoplanet mass measurements?',
      author: 'PhD Student',
      category: 'measurement-techniques',
      answers: 7,
      votes: 15,
      timeAgo: '2 days ago',
      isAnswered: true
    }
  ];

  const showcase = [
    {
      id: 1,
      title: 'Interactive Exoplanet Database Visualization',
      author: 'Data Scientist',
      type: 'tool',
      description: 'A web-based tool for exploring exoplanet data with interactive visualizations and filtering capabilities.',
      image: '/api/placeholder/400/200',
      likes: 34,
      views: 156,
      timeAgo: '1 week ago'
    },
    {
      id: 2,
      title: '3D Model of TRAPPIST-1 System',
      author: '3D Artist',
      type: 'visualization',
      description: 'Detailed 3D model of the TRAPPIST-1 planetary system with accurate orbital mechanics and planet properties.',
      image: '/api/placeholder/400/200',
      likes: 28,
      views: 203,
      timeAgo: '2 weeks ago'
    }
  ];

  const stats = [
    { label: 'Active Members', value: '2,847', icon: Users },
    { label: 'Discussions', value: '1,234', icon: MessageCircle },
    { label: 'Research Papers', value: '456', icon: BookOpen },
    { label: 'Questions Answered', value: '3,891', icon: MessageSquare }
  ];

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCategoryColor = (category) => {
    switch (category) {
      case 'discovery': return '#10b981';
      case 'research': return '#3b82f6';
      case 'discussion': return '#8b5cf6';
      case 'showcase': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'discovery': return Target;
      case 'research': return BookOpen;
      case 'discussion': return MessageCircle;
      case 'showcase': return Star;
      default: return MessageCircle;
    }
  };

  const renderDiscussions = () => (
    <div className="discussions-content">
      <div className="discussions-list">
        {filteredDiscussions.map((discussion, index) => {
          const CategoryIcon = getCategoryIcon(discussion.category);
          return (
            <motion.article
              key={discussion.id}
              className={`discussion-card ${discussion.isPinned ? 'pinned' : ''} ${discussion.isHot ? 'hot' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className="discussion-header">
                <div className="discussion-meta">
                  <div className="author-info">
                    <div className="author-avatar">{discussion.avatar}</div>
                    <div className="author-details">
                      <div className="author-name">{discussion.author}</div>
                      <div className="author-role">{discussion.authorRole}</div>
                    </div>
                  </div>
                  <div className="discussion-badges">
                    {discussion.isPinned && (
                      <span className="badge pinned">📌 Pinned</span>
                    )}
                    {discussion.isHot && (
                      <span className="badge hot">🔥 Hot</span>
                    )}
                    <span 
                      className="badge category"
                      style={{ backgroundColor: getCategoryColor(discussion.category) }}
                    >
                      <CategoryIcon size={12} />
                      {discussion.category}
                    </span>
                  </div>
                </div>
                <div className="discussion-time">{discussion.timeAgo}</div>
              </div>

              <h3 className="discussion-title">{discussion.title}</h3>
              
              <p className="discussion-content">{discussion.content}</p>

              <div className="discussion-tags">
                {discussion.tags.map((tag, idx) => (
                  <span key={idx} className="tag">#{tag}</span>
                ))}
              </div>

              <div className="discussion-actions">
                <div className="action-group">
                  <button className="action-button">
                    <ThumbsUp size={16} />
                    {discussion.likes}
                  </button>
                  <button className="action-button">
                    <Reply size={16} />
                    {discussion.replies}
                  </button>
                  <button className="action-button">
                    <Eye size={16} />
                    {discussion.views}
                  </button>
                </div>
                <div className="action-group">
                  <button className="action-button">
                    <Bookmark size={16} />
                  </button>
                  <button className="action-button">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );

  const renderResearch = () => (
    <div className="research-content">
      <div className="research-list">
        {researchPapers.map((paper, index) => (
          <motion.article
            key={paper.id}
            className="research-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className="research-header">
              <h3 className="research-title">{paper.title}</h3>
              <div className="research-meta">
                <span className="research-journal">{paper.journal}</span>
                <span className="research-year">{paper.year}</span>
              </div>
            </div>
            
            <div className="research-authors">
              {paper.authors.map((author, idx) => (
                <span key={idx} className="author-name">{author}</span>
              ))}
            </div>
            
            <p className="research-abstract">{paper.abstract}</p>
            
            <div className="research-footer">
              <div className="research-tags">
                {paper.tags.map((tag, idx) => (
                  <span key={idx} className="tag">#{tag}</span>
                ))}
              </div>
              <div className="research-stats">
                <span className="stat">
                  <Award size={14} />
                  {paper.citations} citations
                </span>
                <a href={`https://doi.org/${paper.doi}`} className="doi-link">
                  DOI: {paper.doi}
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );

  const renderQuestions = () => (
    <div className="questions-content">
      <div className="questions-list">
        {questions.map((question, index) => (
          <motion.article
            key={question.id}
            className={`question-card ${question.isAnswered ? 'answered' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className="question-header">
              <h3 className="question-title">{question.title}</h3>
              <div className="question-badges">
                {question.isAnswered && (
                  <span className="badge answered">✅ Answered</span>
                )}
                <span className="badge category">{question.category}</span>
              </div>
            </div>
            
            <div className="question-meta">
              <div className="question-author">
                <User size={14} />
                {question.author}
              </div>
              <div className="question-time">
                <Clock size={14} />
                {question.timeAgo}
              </div>
            </div>
            
            <div className="question-stats">
              <div className="stat">
                <MessageSquare size={14} />
                {question.answers} answers
              </div>
              <div className="stat">
                <ThumbsUp size={14} />
                {question.votes} votes
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );

  const renderShowcase = () => (
    <div className="showcase-content">
      <div className="showcase-grid">
        {showcase.map((item, index) => (
          <motion.article
            key={item.id}
            className="showcase-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className="showcase-image">
              <div className="placeholder-image">
                <Star size={48} />
              </div>
              <div className="showcase-type">{item.type}</div>
            </div>
            
            <div className="showcase-content">
              <h3 className="showcase-title">{item.title}</h3>
              <div className="showcase-author">
                <User size={14} />
                {item.author}
              </div>
              <p className="showcase-description">{item.description}</p>
              
              <div className="showcase-footer">
                <div className="showcase-stats">
                  <span className="stat">
                    <ThumbsUp size={14} />
                    {item.likes}
                  </span>
                  <span className="stat">
                    <Eye size={14} />
                    {item.views}
                  </span>
                </div>
                <div className="showcase-time">{item.timeAgo}</div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discussions':
        return renderDiscussions();
      case 'research':
        return renderResearch();
      case 'questions':
        return renderQuestions();
      case 'showcase':
        return renderShowcase();
      default:
        return renderDiscussions();
    }
  };

  return (
    <div className="community">
      <div className="container">
        {/* Header */}
        <motion.div
          className="community-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">
            <span className="gradient-text">Community</span> Hub
          </h1>
          <p className="page-description">
            Connect with researchers, share knowledge, and collaborate on exoplanet research
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="community-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="stat-card">
                <Icon size={24} className="stat-icon" />
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Search and Tabs */}
        <motion.div
          className="community-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search discussions, papers, questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="community-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="community-content"
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {renderTabContent()}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="community-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>Join the Conversation</h2>
          <p>Share your research, ask questions, and connect with the exoplanet community</p>
          <div className="cta-actions">
            <button className="btn btn-primary">
              <Plus size={20} />
              Start Discussion
            </button>
            <button className="btn btn-outline">
              <Github size={20} />
              Contribute Code
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Community;
