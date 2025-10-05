-- =====================================================
-- EXOPLANET LLM COMPLETE SUPABASE DATABASE SCHEMA
-- =====================================================
-- Run this entire SQL script in your Supabase SQL Editor
-- Project: ujqykcvwhdqetjqitlzv.supabase.co

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CREATE CUSTOM TYPES
-- =====================================================

-- User roles
CREATE TYPE user_role AS ENUM ('user', 'researcher', 'admin');

-- Discussion status
CREATE TYPE discussion_status AS ENUM ('active', 'closed', 'archived');

-- Paper status
CREATE TYPE paper_status AS ENUM ('draft', 'published', 'reviewed');

-- Notification types
CREATE TYPE notification_type AS ENUM (
    'discussion_reply', 
    'paper_comment', 
    'formula_approval', 
    'system',
    'mention',
    'like',
    'follow'
);

-- =====================================================
-- 2. CREATE TABLES
-- =====================================================

-- User profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    specialization VARCHAR(100),
    institution VARCHAR(200),
    website TEXT,
    social_links JSONB DEFAULT '{}',
    location VARCHAR(100),
    timezone VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research discussions table
CREATE TABLE discussions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category VARCHAR(50) DEFAULT 'general',
    tags TEXT[] DEFAULT '{}',
    status discussion_status DEFAULT 'active',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    difficulty_level VARCHAR(20) DEFAULT 'beginner',
    estimated_read_time INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussion comments table
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    likes INTEGER DEFAULT 0,
    is_solution BOOLEAN DEFAULT FALSE,
    is_helpful BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research papers table
CREATE TABLE research_papers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    abstract TEXT,
    content TEXT,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    co_authors TEXT[] DEFAULT '{}',
    doi VARCHAR(200),
    arxiv_id VARCHAR(50),
    journal VARCHAR(200),
    publication_date DATE,
    status paper_status DEFAULT 'draft',
    tags TEXT[] DEFAULT '{}',
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    citations INTEGER DEFAULT 0,
    file_url TEXT,
    file_size BIGINT,
    is_peer_reviewed BOOLEAN DEFAULT FALSE,
    peer_reviewers TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mathematical formulas table
CREATE TABLE formulas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    formula TEXT NOT NULL,
    variables JSONB NOT NULL,
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    source VARCHAR(200),
    example_usage TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES profiles(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    difficulty_level VARCHAR(20) DEFAULT 'intermediate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat conversations table
CREATE TABLE conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200),
    model_used VARCHAR(100) DEFAULT 'exoplanet-llm',
    settings JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    message_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    token_count INTEGER DEFAULT 0,
    processing_time_ms INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites table
CREATE TABLE favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('discussion', 'paper', 'formula', 'conversation')),
    item_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User follows table
CREATE TABLE follows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Likes table
CREATE TABLE likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('discussion', 'comment', 'paper', 'formula')),
    item_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- Tags table
CREATE TABLE tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#667eea',
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Profiles indexes
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_specialization ON profiles(specialization);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- Discussions indexes
CREATE INDEX idx_discussions_author ON discussions(author_id);
CREATE INDEX idx_discussions_category ON discussions(category);
CREATE INDEX idx_discussions_status ON discussions(status);
CREATE INDEX idx_discussions_created_at ON discussions(created_at DESC);
CREATE INDEX idx_discussions_views ON discussions(views DESC);
CREATE INDEX idx_discussions_likes ON discussions(likes DESC);
CREATE INDEX idx_discussions_pinned ON discussions(is_pinned);
CREATE INDEX idx_discussions_featured ON discussions(is_featured);
CREATE INDEX idx_discussions_tags ON discussions USING GIN(tags);

-- Comments indexes
CREATE INDEX idx_comments_discussion ON comments(discussion_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_comments_solution ON comments(is_solution);

-- Research papers indexes
CREATE INDEX idx_papers_author ON research_papers(author_id);
CREATE INDEX idx_papers_status ON research_papers(status);
CREATE INDEX idx_papers_created_at ON research_papers(created_at DESC);
CREATE INDEX idx_papers_publication_date ON research_papers(publication_date DESC);
CREATE INDEX idx_papers_citations ON research_papers(citations DESC);
CREATE INDEX idx_papers_journal ON research_papers(journal);
CREATE INDEX idx_papers_tags ON research_papers USING GIN(tags);

-- Formulas indexes
CREATE INDEX idx_formulas_category ON formulas(category);
CREATE INDEX idx_formulas_author ON formulas(author_id);
CREATE INDEX idx_formulas_verified ON formulas(is_verified);
CREATE INDEX idx_formulas_created_at ON formulas(created_at DESC);
CREATE INDEX idx_formulas_usage_count ON formulas(usage_count DESC);
CREATE INDEX idx_formulas_tags ON formulas USING GIN(tags);

-- Conversations indexes
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX idx_conversations_archived ON conversations(is_archived);

-- Messages indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_role ON messages(role);

-- Favorites indexes
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_item ON favorites(item_type, item_id);
CREATE INDEX idx_favorites_created_at ON favorites(created_at DESC);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Follows indexes
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_follows_created_at ON follows(created_at DESC);

-- Likes indexes
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_item ON likes(item_type, item_id);
CREATE INDEX idx_likes_created_at ON likes(created_at DESC);

-- Tags indexes
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_usage_count ON tags(usage_count DESC);

-- =====================================================
-- 4. CREATE TRIGGER FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update view counts
CREATE OR REPLACE FUNCTION increment_view_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE discussions SET views = views + 1 WHERE id = NEW.discussion_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Function to update like counts
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE discussions SET likes = likes + 1 WHERE id = NEW.item_id AND NEW.item_type = 'discussion';
        UPDATE comments SET likes = likes + 1 WHERE id = NEW.item_id AND NEW.item_type = 'comment';
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE discussions SET likes = likes - 1 WHERE id = OLD.item_id AND OLD.item_type = 'discussion';
        UPDATE comments SET likes = likes - 1 WHERE id = OLD.item_id AND OLD.item_type = 'comment';
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Function to update message count
CREATE OR REPLACE FUNCTION update_message_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE conversations SET message_count = message_count + 1 WHERE id = NEW.conversation_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE conversations SET message_count = message_count - 1 WHERE id = OLD.conversation_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- =====================================================
-- 5. CREATE TRIGGERS
-- =====================================================

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON discussions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_papers_updated_at BEFORE UPDATE ON research_papers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_formulas_updated_at BEFORE UPDATE ON formulas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Like count triggers
CREATE TRIGGER update_like_count_trigger AFTER INSERT OR DELETE ON likes FOR EACH ROW EXECUTE FUNCTION update_like_count();

-- Message count triggers
CREATE TRIGGER update_message_count_trigger AFTER INSERT OR DELETE ON messages FOR EACH ROW EXECUTE FUNCTION update_message_count();

-- =====================================================
-- 6. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. CREATE RLS POLICIES
-- =====================================================

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Discussions policies
CREATE POLICY "Discussions are viewable by everyone" ON discussions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create discussions" ON discussions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own discussions" ON discussions FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own discussions" ON discussions FOR DELETE USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own comments" ON comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own comments" ON comments FOR DELETE USING (auth.uid() = author_id);

-- Research papers policies
CREATE POLICY "Published papers are viewable by everyone" ON research_papers FOR SELECT USING (status = 'published');
CREATE POLICY "Users can view their own papers" ON research_papers FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Users can create papers" ON research_papers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own papers" ON research_papers FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own papers" ON research_papers FOR DELETE USING (auth.uid() = author_id);

-- Formulas policies
CREATE POLICY "Formulas are viewable by everyone" ON formulas FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create formulas" ON formulas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own formulas" ON formulas FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own formulas" ON formulas FOR DELETE USING (auth.uid() = author_id);

-- Conversations policies
CREATE POLICY "Users can view their own conversations" ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own conversations" ON conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own conversations" ON conversations FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT USING (
    conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create messages in their conversations" ON messages FOR INSERT WITH CHECK (
    conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid())
);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Follows are viewable by everyone" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can create follows" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete their own follows" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can create likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON likes FOR DELETE USING (auth.uid() = user_id);

-- Tags policies
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tags" ON tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- 8. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample tags
INSERT INTO tags (name, description, color) VALUES
    ('exoplanet', 'Planets outside our solar system', '#10b981'),
    ('habitability', 'Planetary habitability analysis', '#3b82f6'),
    ('atmospheres', 'Planetary atmospheric studies', '#8b5cf6'),
    ('transit-method', 'Exoplanet detection via transit', '#f59e0b'),
    ('radial-velocity', 'Exoplanet detection via RV', '#ef4444'),
    ('jwst', 'James Webb Space Telescope', '#06b6d4'),
    ('kepler', 'Kepler Space Telescope', '#84cc16'),
    ('tess', 'TESS Mission', '#f97316'),
    ('machine-learning', 'AI and ML applications', '#8b5cf6'),
    ('spectroscopy', 'Spectral analysis techniques', '#06b6d4');

-- Insert sample discussion (will work after user signs up)
INSERT INTO discussions (title, content, category, tags, difficulty_level) VALUES
    ('Welcome to the Exoplanet Community!', 
     'Welcome to our community of exoplanet researchers, enthusiasts, and students. This is a place to share knowledge, ask questions, and collaborate on the exciting field of exoplanet science. Feel free to start discussions, share research, and connect with fellow space explorers!',
     'general',
     ARRAY['welcome', 'community', 'exoplanet'],
     'beginner');

-- Insert sample formula
INSERT INTO formulas (name, description, formula, variables, category, subcategory, source, example_usage) VALUES
    ('Kepler''s Third Law',
     'Relates the orbital period of a planet to its semi-major axis and the mass of the star',
     'P² = (4π²a³) / (G(M₁ + M₂))',
     '{"P": "Orbital period (years)", "a": "Semi-major axis (AU)", "G": "Gravitational constant", "M₁": "Star mass (solar masses)", "M₂": "Planet mass (solar masses)"}',
     'orbital_mechanics',
     'kepler_laws',
     'Kepler, J. (1609). Astronomia nova',
     'For a planet orbiting a 1 solar mass star at 1 AU: P² = 4π²(1)³/(G(1+0)) = 4π²/G ≈ 1 year²');

-- =====================================================
-- 9. CREATE FUNCTIONS FOR COMMON OPERATIONS
-- =====================================================

-- Function to search discussions
CREATE OR REPLACE FUNCTION search_discussions(search_term TEXT, category_filter TEXT DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    content TEXT,
    author_id UUID,
    category VARCHAR,
    tags TEXT[],
    views INTEGER,
    likes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    author_username VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.title,
        d.content,
        d.author_id,
        d.category,
        d.tags,
        d.views,
        d.likes,
        d.created_at,
        p.username as author_username
    FROM discussions d
    LEFT JOIN profiles p ON d.author_id = p.id
    WHERE 
        (search_term IS NULL OR (
            d.title ILIKE '%' || search_term || '%' OR
            d.content ILIKE '%' || search_term || '%' OR
            EXISTS (SELECT 1 FROM unnest(d.tags) AS tag WHERE tag ILIKE '%' || search_term || '%')
        ))
        AND (category_filter IS NULL OR d.category = category_filter)
    ORDER BY d.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
    discussions_count BIGINT,
    comments_count BIGINT,
    papers_count BIGINT,
    formulas_count BIGINT,
    total_likes BIGINT,
    followers_count BIGINT,
    following_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM discussions WHERE author_id = user_uuid) as discussions_count,
        (SELECT COUNT(*) FROM comments WHERE author_id = user_uuid) as comments_count,
        (SELECT COUNT(*) FROM research_papers WHERE author_id = user_uuid) as papers_count,
        (SELECT COUNT(*) FROM formulas WHERE author_id = user_uuid) as formulas_count,
        (SELECT COALESCE(SUM(likes), 0) FROM discussions WHERE author_id = user_uuid) +
        (SELECT COALESCE(SUM(likes), 0) FROM comments WHERE author_id = user_uuid) as total_likes,
        (SELECT COUNT(*) FROM follows WHERE following_id = user_uuid) as followers_count,
        (SELECT COUNT(*) FROM follows WHERE follower_id = user_uuid) as following_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. CREATE VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for discussion summaries
CREATE VIEW discussion_summaries AS
SELECT 
    d.id,
    d.title,
    d.content,
    d.category,
    d.tags,
    d.views,
    d.likes,
    d.is_pinned,
    d.is_featured,
    d.created_at,
    p.username as author_username,
    p.full_name as author_name,
    p.avatar_url as author_avatar,
    p.specialization as author_specialization,
    (SELECT COUNT(*) FROM comments WHERE discussion_id = d.id) as comment_count
FROM discussions d
LEFT JOIN profiles p ON d.author_id = p.id
WHERE d.status = 'active';

-- View for popular content
CREATE VIEW popular_content AS
SELECT 
    'discussion' as content_type,
    id,
    title,
    views + likes * 2 as popularity_score,
    created_at
FROM discussions
WHERE status = 'active'
UNION ALL
SELECT 
    'paper' as content_type,
    id,
    title,
    views + citations * 3 as popularity_score,
    created_at
FROM research_papers
WHERE status = 'published'
ORDER BY popularity_score DESC, created_at DESC;

-- =====================================================
-- SCHEMA CREATION COMPLETE!
-- =====================================================

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '🎉 Exoplanet LLM Database Schema Created Successfully!';
    RAISE NOTICE '📊 Tables: 12 created';
    RAISE NOTICE '🔒 RLS Policies: Enabled';
    RAISE NOTICE '📈 Indexes: 25+ created';
    RAISE NOTICE '⚡ Triggers: 6 created';
    RAISE NOTICE '🔧 Functions: 3 created';
    RAISE NOTICE '👁️ Views: 2 created';
    RAISE NOTICE '🌟 Ready for your Exoplanet Community!';
END $$;
