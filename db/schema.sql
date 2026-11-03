\restrict dbmate

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: data_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_points (
    cursor character varying(512) NOT NULL,
    m3ter_id bigint NOT NULL,
    nonce bigint NOT NULL,
    voltage double precision NOT NULL,
    current double precision NOT NULL,
    energy double precision NOT NULL,
    signature character varying(88) NOT NULL,
    public_key character varying(44) NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    block_height bigint NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: data_points data_points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_points
    ADD CONSTRAINT data_points_pkey PRIMARY KEY (cursor);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- PostgreSQL database dump complete
--

\unrestrict dbmate


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20261103082437');
