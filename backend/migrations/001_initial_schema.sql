
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'CLERK')),
    area_council VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Process Data Table
CREATE TABLE process_data (
    id SERIAL PRIMARY KEY,
    pu_id VARCHAR(50) NOT NULL,
    arrival_time TIMESTAMP WITH TIME ZONE,
    personnel_stats JSONB DEFAULT '{}',
    material_stats JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Result Data Table
CREATE TABLE result_data (
    id SERIAL PRIMARY KEY,
    pu_id VARCHAR(50) NOT NULL,
    party_votes JSONB DEFAULT '{}',
    total_valid INTEGER DEFAULT 0,
    rejected INTEGER DEFAULT 0,
    accredited INTEGER DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Collation Data Table
CREATE TABLE collation_data (
    id SERIAL PRIMARY KEY,
    level VARCHAR(50) NOT NULL CHECK (level IN ('ward', 'lga')),
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50),
    presence JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
