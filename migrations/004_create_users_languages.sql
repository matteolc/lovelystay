-- Drop referenced tables
DROP TABLE IF EXISTS users_languages;

-- Create the users table
CREATE TABLE users_languages (
  user_id UUID,
  language_id UUID,
  CONSTRAINT fk_users_languages_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_users_languages_language FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, language_id)
);

-- Add indexes
CREATE INDEX idx_users_languages_user ON users_languages(user_id);
CREATE INDEX idx_users_languages_language ON users_languages(language_id);