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
  citizen_id varchar(64) unique,
  phone varchar(32),
  address text,
  height_cm integer,
  weight_kg integer,
  blood_type varchar(10),
  insurance_number varchar(64),
  emergency_contact_name varchar(255),
  emergency_contact_phone varchar(32),
  emergency_contact_relation varchar(100),
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

