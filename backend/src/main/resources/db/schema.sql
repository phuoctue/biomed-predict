create table if not exists users (
  id uuid primary key,
  email varchar(255) not null unique,
  password_hash varchar(255) not null,
  full_name varchar(255) not null,
  role varchar(50) not null,
  department varchar(255),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists patients (
  id uuid primary key,
  mrn varchar(64) not null unique,
  full_name varchar(255) not null,
  date_of_birth date,
  sex varchar(20),
  diagnosis text,
  allergies text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists drugs (
  id uuid primary key,
  name varchar(255) not null,
  generic_name varchar(255),
  drug_class varchar(255),
  dosage_form varchar(255),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists evaluations (
  id uuid primary key,
  patient_id uuid references patients(id),
  drug_id uuid references drugs(id),
  evaluator_id uuid references users(id),
  suitability_score integer not null,
  risk_level varchar(50) not null,
  summary text,
  raw_explanation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

