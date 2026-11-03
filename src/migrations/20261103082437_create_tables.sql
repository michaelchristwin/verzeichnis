-- migrate:up
CREATE TABLE IF NOT EXISTS data_points(
    cursor VARCHAR(512) PRIMARY KEY,
    m3ter_id INTEGER NOT NULL,
    nonce BIGINT NOT NULL,
    voltage DOUBLE PRECISION NOT NULL,
    current DOUBLE PRECISION NOT NULL,
    energy DOUBLE PRECISION NOT NULL,
    signature VARCHAR(88) NOT NULL,
    public_key VARCHAR(44) NOT NULL,
    timestamp TIMESTAMPZ NOT NULL,
    block_height BIGINT NOT NULL,
);

CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down
DROP TABLE data_points;


