#!/usr/bin/env python3
"""
Sports Data Fetcher - Database Setup Script

This script creates the database and tables required for the sports data fetcher.
"""

import os
import sys
import mysql.connector
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database Configuration
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
}

DB_NAME = os.getenv("DB_NAME", "sports_data")

# SQL to create database and tables
CREATE_DATABASE = f"CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# SQL to create tables (imported from database_schema.sql)
with open("database_schema.sql", "r") as f:
    CREATE_TABLES = f.read()

def setup_database():
    """Create the database and tables."""
    print("Sports Data Fetcher - Database Setup")
    print("===================================")
    print(f"Setting up database: {DB_NAME}")
    
    try:
        # Connect to MySQL server
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Create database
        print(f"Creating database {DB_NAME} if it doesn't exist...")
        cursor.execute(CREATE_DATABASE)
        
        # Switch to the database
        cursor.execute(f"USE {DB_NAME};")
        
        # Create tables
        print("Creating tables...")
        for statement in CREATE_TABLES.split(';'):
            if statement.strip():
                cursor.execute(statement + ';')
        
        conn.commit()
        print("Database setup completed successfully!")
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        sys.exit(1)
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    setup_database()
