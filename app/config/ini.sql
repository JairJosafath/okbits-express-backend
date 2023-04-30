CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE, 
    alias TEXT NOT NULL,
    profile TEXT,
    hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
  );
  
  CREATE TABLE files(
    id SERIAL PRIMARY KEY,
    user_id int NOT NULL,
    name TEXT NOT NULL,
    size TEXT NOT NULL,
    path TEXT NOT NULL,
    data_UNL BYTEA,
    data_PDF BYTEA,
    data_JSON BYTEA,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    owner TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE sessions (
  sid TEXT PRIMARY KEY,
  sess JSON ,
  expire TIMESTAMP NOT NULL DEFAULT NOW()
);