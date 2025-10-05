import { useState, useEffect } from 'react'
import { supabase, db } from '../lib/supabase'

// Authentication hook
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signUp = async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }
}

// Profile management hook
export const useProfile = (userId) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      const { data, error } = await db.profiles()
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [userId])

  const updateProfile = async (updates) => {
    const { data, error } = await db.profiles()
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (!error) {
      setProfile(data)
    }
    return { data, error }
  }

  return { profile, loading, updateProfile }
}

// Discussions hook
export const useDiscussions = (category = null, limit = 10) => {
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDiscussions = async () => {
      let query = db.discussions()
        .select(`
          *,
          profiles:author_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching discussions:', error)
      } else {
        setDiscussions(data || [])
      }
      setLoading(false)
    }

    fetchDiscussions()
  }, [category, limit])

  const createDiscussion = async (discussionData) => {
    const { data, error } = await db.discussions()
      .insert(discussionData)
      .select()
      .single()

    if (!error) {
      setDiscussions(prev => [data, ...prev])
    }
    return { data, error }
  }

  return { discussions, loading, createDiscussion }
}

// Comments hook
export const useComments = (discussionId) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!discussionId) {
      setLoading(false)
      return
    }

    const fetchComments = async () => {
      const { data, error } = await db.comments()
        .select(`
          *,
          profiles:author_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('discussion_id', discussionId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching comments:', error)
      } else {
        setComments(data || [])
      }
      setLoading(false)
    }

    fetchComments()
  }, [discussionId])

  const addComment = async (commentData) => {
    const { data, error } = await db.comments()
      .insert(commentData)
      .select(`
        *,
        profiles:author_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .single()

    if (!error) {
      setComments(prev => [...prev, data])
    }
    return { data, error }
  }

  return { comments, loading, addComment }
}

// Formulas hook
export const useFormulas = (category = null, limit = 20) => {
  const [formulas, setFormulas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFormulas = async () => {
      let query = db.formulas()
        .select(`
          *,
          profiles:author_id (
            username,
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching formulas:', error)
      } else {
        setFormulas(data || [])
      }
      setLoading(false)
    }

    fetchFormulas()
  }, [category, limit])

  const createFormula = async (formulaData) => {
    const { data, error } = await db.formulas()
      .insert(formulaData)
      .select()
      .single()

    if (!error) {
      setFormulas(prev => [data, ...prev])
    }
    return { data, error }
  }

  return { formulas, loading, createFormula }
}

// Research papers hook
export const useResearchPapers = (status = 'published', limit = 10) => {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPapers = async () => {
      const { data, error } = await db.papers()
        .select(`
          *,
          profiles:author_id (
            username,
            full_name,
            institution
          )
        `)
        .eq('status', status)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching papers:', error)
      } else {
        setPapers(data || [])
      }
      setLoading(false)
    }

    fetchPapers()
  }, [status, limit])

  const createPaper = async (paperData) => {
    const { data, error } = await db.papers()
      .insert(paperData)
      .select()
      .single()

    if (!error) {
      setPapers(prev => [data, ...prev])
    }
    return { data, error }
  }

  return { papers, loading, createPaper }
}

// Notifications hook
export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchNotifications = async () => {
      const { data, error } = await db.notifications()
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching notifications:', error)
      } else {
        setNotifications(data || [])
      }
      setLoading(false)
    }

    fetchNotifications()
  }, [userId])

  const markAsRead = async (notificationId) => {
    const { error } = await db.notifications()
      .update({ is_read: true })
      .eq('id', notificationId)

    if (!error) {
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      )
    }
    return { error }
  }

  return { notifications, loading, markAsRead }
}
