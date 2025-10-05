-- Exoplanet LLM Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'researcher', 'admin');
CREATE TYPE discussion_status AS ENUM ('active', 'closed', 'archived');
CREATE TYPE paper_status AS ENUM ('draft', 'published', 'reviewed');
CREATE TYPE notification_type AS ENUM ('discussion_reply', 'paper_comment', 'formula_approval', 'system');

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_discussions_author ON discussions(author_id);
CREATE INDEX idx_discussions_category ON discussions(category);
CREATE INDEX idx_discussions_created_at ON discussions(created_at DESC);
CREATE INDEX idx_discussions_status ON discussions(status);

CREATE INDEX idx_comments_discussion ON comments(discussion_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

CREATE INDEX idx_papers_author ON research_papers(author_id);
CREATE INDEX idx_papers_status ON research_papers(status);
CREATE INDEX idx_papers_created_at ON research_papers(created_at DESC);

CREATE INDEX idx_formulas_category ON formulas(category);
CREATE INDEX idx_formulas_author ON formulas(author_id);
CREATE INDEX idx_formulas_verified ON formulas(is_verified);

CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_item ON favorites(item_type, item_id);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON discussions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_papers_updated_at BEFORE UPDATE ON research_papers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_formulas_updated_at BEFORE UPDATE ON formulas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

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

-- Insert sample data
INSERT INTO profiles (id, username, full_name, bio, role, specialization) VALUES
    (auth.uid(), 'exoplanet_researcher', 'Dr. Space Explorer', 'Passionate about exoplanet discovery and habitability analysis', 'researcher', 'Exoplanet Science'),
    (uuid_generate_v4(), 'astro_enthusiast', 'Jane Stargazer', 'Amateur astronomer and exoplanet enthusiast', 'user', 'Astronomy');

-- Sample discussion
INSERT INTO discussions (title, content, author_id, category, tags) VALUES
    ('Kepler-452b: Earth''s Cousin or Just Another Planet?', 
     'Recent analysis of Kepler-452b data suggests it might be more Earth-like than initially thought. What are your thoughts on the habitability potential?',
     (SELECT id FROM profiles WHERE username = 'exoplanet_researcher' LIMIT 1),
     'habitability',
     ARRAY['kepler-452b', 'habitability', 'exoplanet-analysis']);

-- Sample formula
INSERT INTO formulas (name, description, formula, variables, category, subcategory, author_id, source) VALUES
    ('Kepler''s Third Law',
     'Relates the orbital period of a planet to its semi-major axis and the mass of the star',
     'P² = (4π²a³) / (G(M₁ + M₂))',
     '{"P": "Orbital period", "a": "Semi-major axis", "G": "Gravitational constant", "M₁": "Star mass", "M₂": "Planet mass"}',
     'orbital_mechanics',
     'kepler_laws',
     (SELECT id FROM profiles WHERE username = 'exoplanet_researcher' LIMIT 1),
     'Kepler, J. (1609). Astronomia nova');

-- Sample research paper
INSERT INTO research_papers (title, abstract, author_id, status, tags) VALUES
    ('Exoplanet Atmospheric Composition Analysis Using JWST Data',
     'This paper presents a comprehensive analysis of exoplanet atmospheres using data from the James Webb Space Telescope...',
     (SELECT id FROM profiles WHERE username = 'exoplanet_researcher' LIMIT 1),
     'published',
     ARRAY['jwst', 'atmospheres', 'exoplanets', 'spectroscopy']);
