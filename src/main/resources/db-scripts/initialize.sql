CREATE SCHEMA IF NOT EXISTS "helix-lab"; 


CREATE SEQUENCE helix-lab.user_id_seq INCREMENT 1 MINVALUE 1 START 1 CACHE 1;
CREATE SEQUENCE helix-lab.group_id_seq INCREMENT 1 MINVALUE 1 START 1 CACHE 1;

CREATE TABLE users (
    id INTEGER NOT NULL,
    name VARCHAR(255) UNIQUE,
    admin BOOLEAN,
    last_activity TIMESTAMP,
    cookie_id VARCHAR(255) NOT NULL UNIQUE,
    state TEXT,
    PRIMARY KEY(id)
);


CREATE TABLE groups (
	id INTEGER NOT NULL, 
	name VARCHAR(255), 
	PRIMARY KEY (id), 
	UNIQUE (name)
);

CREATE TABLE user_group_map (
	user_id INTEGER NOT NULL, 
	group_id INTEGER NOT NULL, 
	PRIMARY KEY (user_id, group_id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(group_id) REFERENCES groups (id)
);
