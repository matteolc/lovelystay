-- Drop referenced tables
DROP TABLE IF EXISTS languages;
-- Drop the existing users table if it exists
DROP TABLE IF EXISTS users;

-- Create the users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  login VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  location VARCHAR(255),
  -- Languages array
  languages VARCHAR(50)[] DEFAULT ARRAY[]::VARCHAR(50)[],
  -- Additional fields
  public_repos INT,
  followers INT,
  avatar_url TEXT,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_users_location ON users(location);
CREATE INDEX idx_users_login ON users(login);
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_languages ON users USING GIN(languages);

-- Add a unique constraint on the login field
ALTER TABLE users ADD CONSTRAINT uniq_users_login UNIQUE (login);