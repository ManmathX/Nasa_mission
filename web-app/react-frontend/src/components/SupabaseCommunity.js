import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useDiscussions, useAuth } from '../hooks/useSupabase'
import { MessageCircle, Heart, Eye, User, Calendar, Tag } from 'lucide-react'
import './SupabaseCommunity.css'

const SupabaseCommunity = () => {
  const { user } = useAuth()
  const { discussions, loading: discussionsLoading, createDiscussion } = useDiscussions()
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '', category: 'general' })
  const [showNewDiscussion, setShowNewDiscussion] = useState(false)

  const handleCreateDiscussion = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please sign in to create a discussion')
      return
    }

    const { error } = await createDiscussion({
      ...newDiscussion,
      author_id: user.id,
      tags: newDiscussion.content.toLowerCase().match(/\b\w+\b/g) || []
    })

    if (!error) {
      setNewDiscussion({ title: '', content: '', category: 'general' })
      setShowNewDiscussion(false)
    } else {
      console.error('Error creating discussion:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (discussionsLoading) {
    return (
      <div className="supabase-community">
        <div className="loading">Loading discussions...</div>
      </div>
    )
  }

  return (
    <div className="supabase-community">
      <div className="community-header">
        <h2>Community Discussions</h2>
        <p>Join the conversation about exoplanet research and discoveries</p>
        {user && (
          <button 
            className="new-discussion-btn"
            onClick={() => setShowNewDiscussion(!showNewDiscussion)}
          >
            Start New Discussion
          </button>
        )}
      </div>

      {showNewDiscussion && (
        <motion.div 
          className="new-discussion-form"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <form onSubmit={handleCreateDiscussion}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                placeholder="What's your question or topic?"
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={newDiscussion.category}
                onChange={(e) => setNewDiscussion({...newDiscussion, category: e.target.value})}
              >
                <option value="general">General</option>
                <option value="habitability">Habitability</option>
                <option value="discovery">Discovery Methods</option>
                <option value="atmospheres">Atmospheres</option>
                <option value="orbital_mechanics">Orbital Mechanics</option>
                <option value="instruments">Instruments</option>
              </select>
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
                placeholder="Share your thoughts, questions, or research findings..."
                rows={6}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Post Discussion</button>
              <button type="button" onClick={() => setShowNewDiscussion(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="discussions-grid">
        {discussions.map((discussion) => (
          <motion.div
            key={discussion.id}
            className="discussion-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
          >
            <div className="discussion-header">
              <h3>{discussion.title}</h3>
              <span className={`category ${discussion.category}`}>
                {discussion.category}
              </span>
            </div>
            
            <div className="discussion-content">
              <p>{discussion.content.substring(0, 200)}...</p>
            </div>

            <div className="discussion-meta">
              <div className="author">
                <User size={16} />
                <span>{discussion.profiles?.username || 'Anonymous'}</span>
              </div>
              <div className="date">
                <Calendar size={16} />
                <span>{formatDate(discussion.created_at)}</span>
              </div>
            </div>

            <div className="discussion-stats">
              <div className="stat">
                <Eye size={16} />
                <span>{discussion.views}</span>
              </div>
              <div className="stat">
                <Heart size={16} />
                <span>{discussion.likes}</span>
              </div>
              <div className="stat">
                <MessageCircle size={16} />
                <span>0</span>
              </div>
            </div>

            {discussion.tags && discussion.tags.length > 0 && (
              <div className="discussion-tags">
                {discussion.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="tag">
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {discussions.length === 0 && (
        <div className="empty-state">
          <MessageCircle size={48} />
          <h3>No discussions yet</h3>
          <p>Be the first to start a conversation about exoplanet research!</p>
        </div>
      )}
    </div>
  )
}

export default SupabaseCommunity
