-- Simple seed data for authentication system
-- Default admin user for initial setup

-- Insert default admin user (password: "admin123")
INSERT OR IGNORE INTO auth_users (id, email, password_hash, name, is_active) VALUES 
  (1, 'admin@yo-decreto.com', 'admin123', 'Administrador', 1);

-- Create a default session (will expire in 30 days)
INSERT OR IGNORE INTO auth_sessions (user_id, session_token, expires_at) VALUES 
  (1, 'default-session-token-' || datetime('now'), datetime('now', '+30 days'));