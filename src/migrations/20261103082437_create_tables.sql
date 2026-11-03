-- migrate:up
CREATE TABLE IF NOT EXISTS data_points(
    cursor VARCHAR(512) PRIMARY KEY,
    m3ter_id BIGINT NOT NULL,
    nonce BIGINT NOT NULL,
    voltage DOUBLE PRECISION NOT NULL,
    current DOUBLE PRECISION NOT NULL,
    energy DOUBLE PRECISION NOT NULL,
    signature VARCHAR(88) NOT NULL,
    public_key VARCHAR(44) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    block_height BIGINT NOT NULL
);

-- migrate:down
DROP TABLE data_points;


