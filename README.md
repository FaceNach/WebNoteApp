# NoteApp - Aplicación de Notas Full-Stack

A brief description of what this project does and who it's for

This is a full-stack notes application built with ASP.NET Core (.NET 9) for the backend, React (Vite) with Tailwind CSS for the frontend, and PostgreSQL as the database. It allows users to create, view, edit, delete, and archive/unarchive notes.


# Features

- Create Notes: Add new notes with a title, content, and tags.

- View Notes: Display a list of all active (non-archived) notes.

- View Archived Notes: Display a separate list of all notes that have been archived.

- Edit Notes: Update existing notes.

- Delete Notes: Permanently remove notes.

- Archive/Unarchive Notes: Mark notes as archived (hides them from the main list) and unarchive them (moves them back to the main list).

- Tagging System: Organize notes with multiple tags.


# Techonologies Used
This project utilizes the following technologies with their specified versions:

## Backend

- .NET SDK: 9.0 (latest development/preview version)

- ASP.NET Core: 9.0

- Entity Framework Core: 9.0

- Npgsql.EntityFrameworkCore.PostgreSQL: 9.0 (or compatible with EF Core 9.0)

## Frontend:

- Node.js: v20.x (LTS - Long Term Support) or v22.x (Current - latest stable)

- npm: v10.x (typically included with Node.js)

- React: ^18.2.0 (latest stable version)

- Vite: ^5.x.x (latest stable version)

- Tailwind CSS: ^3.x.x (latest stable version)

## Database:

- PostgreSQL: 14.x, 15.x, or 16.x (any recent stable version)

- psql client: Compatible with your PostgreSQL version
## Prerequisites

Before running the application, ensure you have the following installed on your system (Linux/macOS):

- .NET SDK 9.0

- Node.js and npm

- PostgreSQL Server (must be running)

- psql command-line client (usually included with PostgreSQL installation)

- dotnet ef global tool:

`dotnet tool install --global dotnet-ef --version 9`

- Git (for cloning the repository)
## Project Structure
The repository is organized into two main directories:

- backend/: Contains the ASP.NET Core API project.

- frontend/: Contains the React application built with Vite.

- start_app.sh: A Bash/Zsh script located at the root for easily running the entire application.


# Getting Started

1. Clone the Repository
Open your terminal and clone the project:

`git clone https://github.com/your-username/your-repo-name.git # Replace with your actual repository URL
cd your-repo-name # Navigate into the cloned directory`

2. Database Setup (PostgreSQL) 
You need to prepare your PostgreSQL database.

a. Ensure PostgreSQL is Running:
Verify that your PostgreSQL server is active. You might need to start it based on your OS:

- macOS (Homebrew): brew services start postgresql

- Linux (systemd): sudo systemctl start postgresql

b. Configure Database User and Password:
The start_app.sh script will use specific credentials to connect to and create the database. You must ensure these match your PostgreSQL setup.

Identify your DB_USER and DB_PASSWORD:

- Often, the default user is your system username or postgres.

- Check your PostgreSQL client setup (e.g., pgAdmin) or your appsettings.Development.json file for Username= and Password= in your ConnectionStrings:DefaultConnection.
