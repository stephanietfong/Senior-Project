-- Users Table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  location_name VARCHAR(255),
  address TEXT,
  image_url TEXT,
  capacity INTEGER,
  is_18_plus BOOLEAN DEFAULT FALSE,
  is_21_plus BOOLEAN DEFAULT FALSE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags Table
CREATE TABLE tags (
  tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RSVPs Table (who is going to what)
CREATE TABLE rsvps (
  rsvp_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL CHECK (status IN ('Maybe', 'Going')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, event_id)
);

-- User_Interests Table (which tags a user likes)
CREATE TABLE user_interests (
  user_interest_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(tag_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, tag_id)
);

-- Event_Tags Table (categorizes events)
CREATE TABLE event_tags (
  event_tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(tag_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, tag_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_events_host_id ON events(host_id);
CREATE INDEX idx_rsvps_user_id ON rsvps(user_id);
CREATE INDEX idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_event_tags_event_id ON event_tags(event_id);
