-- Database initialization script for Teryaq Pharmacy Management System
-- This script will be executed when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist
-- (This is handled by POSTGRES_DB environment variable)

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'pharmacist', 'cashier', 'manager');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('cash', 'card', 'bank_transfer', 'mobile_payment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE medicine_type AS ENUM ('tablet', 'syrup', 'injection', 'cream', 'drops', 'inhaler', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
-- (These will be created when tables are created by the application)

-- Insert initial data (optional)
-- You can add initial data here if needed

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE teryaq_pharmacy TO postgres;
