-- Runs once, when the Postgres volume is first created.
-- One database per app; there is no database shared between apps.
CREATE DATABASE hris;
CREATE DATABASE kpi;
CREATE DATABASE feedback_360;
CREATE DATABASE lms;
CREATE DATABASE prisma;
