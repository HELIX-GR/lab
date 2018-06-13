CREATE SCHEMA IF NOT EXISTS "helix_lab"; 


CREATE SEQUENCE helix_lab.account_to_server_id_seq INCREMENT 1 MINVALUE 1 START 1 CACHE 1;

CREATE SEQUENCE helix_lab.server_id_seq INCREMENT 1 MINVALUE 1 START 1 CACHE 1;

CREATE SEQUENCE helix_lab.group_id_seq INCREMENT 1 MINVALUE 1 START 1 CACHE 1;

CREATE TABLE helix_lab.hub_server (
    id integer NOT NULL DEFAULT nextval('helix_lab.server_id_seq'::regclass),
    name character varying(100) NOT NULL,
    server_url character varying(200) NOT NULL,
    description character varying(100) NOT NULL,
    available boolean,
    admin_token character varying(255) NOT NULL,
    started_at timestamp without time zone DEFAULT now(),
    role_eligible character varying(64) NOT NULL,
    CONSTRAINT pk_hub_server PRIMARY KEY (id)
);

CREATE TABLE helix_lab.account_to_server (
    id integer NOT NULL DEFAULT nextval('helix_lab.account_to_server_id_seq'::regclass),
    name character varying(100) NOT NULL,
    account integer NOT NULL,
    server_id integer NOT NULL,
    server_url character varying(200) NOT NULL,
    started_at timestamp without time zone DEFAULT now(),
    state character varying(64) NOT NULL,
    CONSTRAINT pk_account_to_server PRIMARY KEY (id),
    CONSTRAINT fk_account_to_server_account FOREIGN KEY (account)
      REFERENCES web.account (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT fk_account_to_server_server_id FOREIGN KEY (server_id)
      REFERENCES helix_lab.hub_server (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT uq_account_to_server UNIQUE (account, server_id)
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
