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
  const [discussions, setDiscussions] = useState([
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
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    authorRole: '',
    avatar: '',
    category: 'discussion',
    tags: '',
    content: ''
  });

  // Load discussions from localStorage on mount
  React.useEffect(() => {
    const savedDiscussions = localStorage.getItem('community_discussions');
    if (savedDiscussions) {
      try {
        setDiscussions(JSON.parse(savedDiscussions));
      } catch (error) {
        console.log('Error loading discussions:', error);
      }
    }
  }, []);

  // Save discussions to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('community_discussions', JSON.stringify(discussions));
  }, [discussions]);

  const tabs = [
    { id: 'discussions', label: 'Discussions', icon: MessageCircle },
    { id: 'research', label: 'Research', icon: BookOpen },
    { id: 'questions', label: 'Q&A', icon: MessageSquare },
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitDiscussion = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const newDiscussion = {
      id: Math.max(...discussions.map(d => d.id), 0) + 1,
      title: formData.title,
      author: formData.author,
      authorRole: formData.authorRole,
      avatar: formData.avatar || formData.author.split(' ').map(n => n[0]).join(''),
      category: formData.category,
      tags: tagsArray.length > 0 ? tagsArray : ['general'],
      content: formData.content,
      likes: 0,
      replies: 0,
      views: 0,
      timeAgo: 'just now',
      isPinned: false,
      isHot: false
    };

    setDiscussions(prev => [newDiscussion, ...prev]);
    setFormData({
      title: '',
      author: '',
      authorRole: '',
      avatar: '',
      category: 'discussion',
      tags: '',
      content: ''
    });
    setShowModal(false);
    setActiveTab('discussions');
  };

  const handleLike = (discussionId) => {
    setDiscussions(prev => prev.map(discussion => 
      discussion.id === discussionId 
        ? { ...discussion, likes: discussion.likes + 1 }
        : discussion
    ));
  };

  const handleReply = (discussionId) => {
    setDiscussions(prev => prev.map(discussion => 
      discussion.id === discussionId 
        ? { ...discussion, replies: discussion.replies + 1 }
        : discussion
    ));
  };

  const handleView = (discussionId) => {
    setDiscussions(prev => prev.map(discussion => 
      discussion.id === discussionId 
        ? { ...discussion, views: discussion.views + 1 }
        : discussion
    ));
  };

  const handleBookmark = (discussionId) => {
    alert('Discussion bookmarked!');
  };

  const handleShare = (discussionId) => {
    const discussion = discussions.find(d => d.id === discussionId);
    if (navigator.share) {
      navigator.share({
        title: discussion.title,
        text: discussion.content,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      alert('Discussion link copied to clipboard!');
    }
  };

  const closeQuestionModal = React.useCallback(() => {
    console.log('Closing question modal');
    setSelectedQuestion(null);
  }, []);

  const handlePostAnswer = (e) => {
    e.preventDefault();
    
    if (!answerText.trim()) {
      alert('Please write an answer');
      return;
    }

    if (!selectedQuestion) return;

    const newAnswer = {
      id: Math.max(...selectedQuestion.answers_list.map(a => a.id), 0) + 1,
      author: 'You',
      content: answerText,
      votes: 0,
      timeAgo: 'just now'
    };

    // Update the selected question with new answer
    const updatedQuestion = {
      ...selectedQuestion,
      answers_list: [newAnswer, ...selectedQuestion.answers_list],
      answers: selectedQuestion.answers + 1
    };

    // Update questions array
    const updatedQuestions = questions.map(q => 
      q.id === selectedQuestion.id ? updatedQuestion : q
    );

    // Update the state
    setSelectedQuestion(updatedQuestion);
    setAnswerText('');
    
    // Save to localStorage
    localStorage.setItem('community_questions', JSON.stringify(updatedQuestions));
    
    alert('Answer posted successfully!');
  };

  const researchPapers = [
    {
      id: 1,
      title: 'Atmospheric Characterization of Hot Jupiters Using Machine Learning',
      authors: ['Dylan Keating', 'Nicolas B Cowan'],
      journal: 'Astrophysical Journal',
      year: 2021,
      doi: 'https://academic.oup.com/mnras/article/509/1/289/6396770',
      abstract: 'We present a novel machine learning approach for characterizing exoplanet atmospheres using transmission spectroscopy data from JWST...',
      citations: 23,
      tags: ['machine-learning', 'atmospheric-analysis', 'hot-jupiters']
    },
    {
      id: 2,
      title: 'Detection of Water Vapor in the Atmosphere of K2-18b',
      authors: ['Angelos Tsiaras', 'Ingo P. Waldmann'],
      journal: 'Nature Astronomy',
      year: 2019,
      doi: 'https://www.nature.com/articles/s41550-019-0878-9',
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
      isAnswered: true,
      description: 'I am trying to understand the methods used to analyze exoplanet atmospheres. What are the main techniques and instruments used?',
      answers_list: [
        {
          id: 1,
          author: 'Dr. Sarah Chen',
          content: 'The primary method is transmission spectroscopy. When an exoplanet passes in front of its host star, some of the starlight filters through the planet\'s atmosphere. Different atmospheric gases absorb different wavelengths of light, creating a unique spectral signature.',
          votes: 8,
          timeAgo: '3 hours ago'
        },
        {
          id: 2,
          author: 'Prof. Michael Rodriguez',
          content: 'Another important technique is emission spectroscopy, where we measure the infrared radiation emitted by the planet\'s atmosphere. This is particularly useful for hot Jupiters.',
          votes: 4,
          timeAgo: '2 hours ago'
        }
      ]
    },
    {
      id: 2,
      title: 'What is the difference between the conservative and optimistic habitable zone?',
      author: 'Amateur Astronomer',
      category: 'habitable-zones',
      answers: 3,
      votes: 8,
      timeAgo: '1 day ago',
      isAnswered: false,
      description: 'I keep hearing about these two definitions of habitable zones. Can someone explain the difference and why both are used?',
      answers_list: [
        {
          id: 1,
          author: 'Dr. Emily Watson',
          content: 'The conservative habitable zone is more restrictive - it only includes planets where Earth-like conditions could exist. The optimistic zone is broader and includes planets where life might exist under different conditions.',
          votes: 5,
          timeAgo: '20 hours ago'
        }
      ]
    },
    {
      id: 3,
      title: 'How accurate are current exoplanet mass measurements?',
      author: 'PhD Student',
      category: 'measurement-techniques',
      answers: 7,
      votes: 15,
      timeAgo: '2 days ago',
      isAnswered: true,
      description: 'I\'m working on a research project about exoplanet characterization. How reliable are the mass measurements we get from radial velocity and transit timing?',
      answers_list: [
        {
          id: 1,
          author: 'Dr. James Liu',
          content: 'Radial velocity measurements typically have uncertainties of 10-30% for well-observed planets. Transit timing variations can be even more precise for multi-planet systems.',
          votes: 7,
          timeAgo: '1 day ago'
        },
        {
          id: 2,
          author: 'Prof. Michael Rodriguez',
          content: 'The accuracy depends heavily on the quality of observations and the orbital characteristics of the planet. Planets with longer orbital periods are generally harder to measure accurately.',
          votes: 3,
          timeAgo: '18 hours ago'
        }
      ]
    }
  ];

  const stats = [
    { label: 'Active Members', value: '2,847', icon: Users },
    { label: 'Discussions', value: '1,234', icon: MessageCircle },
    { label: 'Research Papers', value: '456', icon: BookOpen },
    { label: 'Questions Answered', value: '3,891', icon: MessageSquare }
  ];

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSelectedQuestion(null);
      }
    };
    
    if (selectedQuestion) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedQuestion]);

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
                  <button 
                    className="action-button"
                    onClick={() => handleLike(discussion.id)}
                    title="Like this discussion"
                  >
                    <ThumbsUp size={16} />
                    {discussion.likes}
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => handleReply(discussion.id)}
                    title="Reply to this discussion"
                  >
                    <Reply size={16} />
                    {discussion.replies}
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => handleView(discussion.id)}
                    title="View this discussion"
                  >
                    <Eye size={16} />
                    {discussion.views}
                  </button>
                </div>
                <div className="action-group">
                  <button 
                    className="action-button"
                    onClick={() => handleBookmark(discussion.id)}
                    title="Bookmark this discussion"
                  >
                    <Bookmark size={16} />
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => handleShare(discussion.id)}
                    title="Share this discussion"
                  >
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
                <a 
                  href={paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi}`} 
                  className="doi-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {paper.doi.startsWith('http') ? 'View Paper' : `DOI: ${paper.doi}`}
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
            onClick={() => setSelectedQuestion(question)}
            style={{ cursor: 'pointer' }}
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discussions':
        return renderDiscussions();
      case 'research':
        return renderResearch();
      case 'questions':
        return renderQuestions();
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
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={20} />
              Start Discussion
            </button>
            <button className="btn btn-outline">
              <Github size={20} />
              Contribute Code
            </button>
          </div>
        </motion.div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="modal-header">
                <h2>Start a New Discussion</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitDiscussion} className="discussion-form">
                <div className="form-group">
                  <label htmlFor="title">Discussion Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="What's your discussion about?"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="author">Your Name *</label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleFormChange}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="authorRole">Your Role</label>
                    <input
                      type="text"
                      id="authorRole"
                      name="authorRole"
                      value={formData.authorRole}
                      onChange={handleFormChange}
                      placeholder="e.g., Researcher, Student"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="avatar">Avatar (2 letters)</label>
                    <input
                      type="text"
                      id="avatar"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleFormChange}
                      placeholder="e.g., AB"
                      maxLength="2"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                    >
                      <option value="discussion">Discussion</option>
                      <option value="discovery">Discovery</option>
                      <option value="research">Research</option>
                      <option value="showcase">Showcase</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="tags">Tags (comma-separated)</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleFormChange}
                    placeholder="e.g., exoplanet, research, jwst"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="content">Discussion Content *</label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleFormChange}
                    placeholder="Share your thoughts, research, or questions..."
                    rows="6"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Plus size={18} />
                    Post Discussion
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Question Detail Modal */}
        {selectedQuestion && (
          <div 
            className="modal-overlay" 
            onClick={closeQuestionModal}
          >
            <motion.div
              className="modal-content question-detail-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="modal-header">
                <h2>{selectedQuestion.title}</h2>
                <button
                  type="button"
                  className="modal-close"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeQuestionModal();
                  }}
                >
                  ✕
                </button>
              </div>

              <div className="question-detail-content">
                <div className="question-detail-meta">
                  <div className="detail-author">
                    <User size={16} />
                    <div>
                      <div className="detail-author-name">{selectedQuestion.author}</div>
                      <div className="detail-time">{selectedQuestion.timeAgo}</div>
                    </div>
                  </div>
                  <div className="detail-badges">
                    {selectedQuestion.isAnswered && (
                      <span className="badge answered">✅ Answered</span>
                    )}
                    <span className="badge category">{selectedQuestion.category}</span>
                  </div>
                </div>

                <p className="question-detail-description">{selectedQuestion.description}</p>

                <div className="question-detail-stats">
                  <div className="stat">
                    <MessageSquare size={16} />
                    <span>{selectedQuestion.answers} answers</span>
                  </div>
                  <div className="stat">
                    <ThumbsUp size={16} />
                    <span>{selectedQuestion.votes} votes</span>
                  </div>
                </div>

                <div className="answers-section">
                  <h3 className="answers-title">Answers ({selectedQuestion.answers_list.length})</h3>
                  <div className="answers-list">
                    {selectedQuestion.answers_list.map((answer) => (
                      <div key={answer.id} className="answer-item">
                        <div className="answer-header">
                          <div className="answer-author">{answer.author}</div>
                          <div className="answer-time">{answer.timeAgo}</div>
                        </div>
                        <p className="answer-content">{answer.content}</p>
                        <div className="answer-actions">
                          <button className="answer-action-btn">
                            <ThumbsUp size={14} />
                            {answer.votes}
                          </button>
                          <button className="answer-action-btn">
                            <Reply size={14} />
                            Reply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="add-answer-section">
                  <h3>Add Your Answer</h3>
                  <textarea
                    placeholder="Share your knowledge and help the community..."
                    className="answer-textarea"
                    rows="4"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={handlePostAnswer}
                  >
                    <Plus size={16} />
                    Post Answer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
