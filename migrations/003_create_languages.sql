-- Drop referenced tables
DROP TABLE IF EXISTS users_languages;
DROP TABLE IF EXISTS languages;

-- Create the users table
CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name)
);

-- Add indexes
CREATE INDEX idx_languages_name ON languages(name);