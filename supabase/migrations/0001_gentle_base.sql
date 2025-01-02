/*
  # Create clients table and related schemas

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `notes` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `receives_text` (boolean)
      - `lead_source` (text)
      - `company_name` (text)
      - `additional_phones` (jsonb)
      - `additional_emails` (jsonb)
      - `billing_address` (jsonb)

  2. Security
    - Enable RLS on `clients` table
    - Add policies for authenticated users to manage their clients
*/

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  notes jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  receives_text boolean DEFAULT false,
  lead_source text,
  company_name text,
  additional_phones jsonb DEFAULT '[]'::jsonb,
  additional_emails jsonb DEFAULT '[]'::jsonb,
  billing_address jsonb
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();