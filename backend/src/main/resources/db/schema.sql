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
  code varchar(64) not null unique,
  name varchar(255) not null,
  generic_name varchar(255),
  drug_group varchar(255),
  dosage_form varchar(255),
  strength varchar(255),
  unit varchar(50),
  manufacturer varchar(255),
  usage_instructions text,
  recommended_dose text,
  side_effects text,
  storage_condition text,
  status varchar(50) not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ingredients (
  id uuid primary key,
  code varchar(64) not null unique,
  name varchar(255) not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists drug_ingredients (
  id uuid primary key,
  drug_id uuid not null references drugs(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id) on delete cascade,
  concentration varchar(255),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(drug_id, ingredient_id)
);

create table if not exists drug_interactions (
  id uuid primary key,
  source_drug_id uuid not null references drugs(id) on delete cascade,
  target_drug_id uuid not null references drugs(id) on delete cascade,
  severity varchar(50) not null,
  description text,
  recommendation text,
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

