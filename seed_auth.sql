-- Seed data for authentication system
-- Default admin user for initial setup

-- Insert default admin user (password: "admin123" - change this!)
-- Password hash for 'admin123' using bcrypt
INSERT OR IGNORE INTO auth_users (id, email, password_hash, name, is_active) VALUES 
  (1, 'admin@yo-decreto.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 1);

-- Create a default session (will expire in 30 days)
INSERT OR IGNORE INTO auth_sessions (user_id, session_token, expires_at) VALUES 
  (1, 'default-session-token-' || datetime('now'), datetime('now', '+30 days'));

-- Link existing user data to auth user
UPDATE users SET auth_user_id = 1 WHERE auth_user_id IS NULL;