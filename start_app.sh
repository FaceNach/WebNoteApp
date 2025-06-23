#!/bin/bash

# --- Configuration Variables ---
# Your specific database and application settings
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
DB_NAME="NoteApp"
DB_USER="postgres"
DB_PASSWORD="1234"
DB_HOST="localhost"
DB_PORT="5432"

BACKEND_APP_URL="https://localhost:7139"

FRONTEND_APP_URL="http://localhost:5173"

cleanup() {
  echo "--- Stopping the application ---"
  if [ -n "$BACKEND_PID" ]; then
    echo "Shutting down backend (PID: $BACKEND_PID)..."
    kill "$BACKEND_PID" 2>/dev/null
  fi
  if [ -n "$FRONTEND_PID" ]; then
    echo "Shutting down frontend (PID: $FRONTEND_PID)..."
    kill "$FRONTEND_PID" 2>/dev/null
  fi
  echo "Processes stopped."
  exit 0
}

trap cleanup SIGINT SIGTERM

echo "--- Starting application setup and execution ---"

echo "1. Configuring PostgreSQL database..."

export ConnectionStrings__DefaultConnection="Host=$DB_HOST;Port=$DB_PORT;Database=$DB_NAME;Username=$DB_USER;Password=$DB_PASSWORD"

PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "\q" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Error: PostgreSQL server is not accessible at $DB_HOST:$DB_PORT. Please ensure it's running."
    cleanup
fi
echo "PostgreSQL connection established."

echo "Checking or creating database '$DB_NAME'..."
DB_EXISTS=$(PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'")
if [[ "$DB_EXISTS" != "1" ]]; then
    echo "Database '$DB_NAME' not found. Creating it..."
    PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME"
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create the database. Ensure user '$DB_USER' has CREATEDB permissions."
        cleanup
    fi
else
    echo "Database '$DB_NAME' already exists."
fi

echo "Applying Entity Framework Core migrations..."
cd "$BACKEND_DIR" || { echo "Error: Backend directory not found."; cleanup; }

echo "Restoring backend NuGet packages..."
dotnet restore
if [ $? -ne 0 ]; then
    echo "Error: Failed to restore NuGet packages."
    cleanup
fi

dotnet ef database update

if [ $? -ne 0 ]; then
    echo "Error: Database migrations failed. Check console for details."
    cleanup
fi
echo "Migrations applied successfully."
cd ..

echo "2. Starting the .NET backend..."
cd "$BACKEND_DIR" || { echo "Error: Backend directory not found."; cleanup; }

echo "Building the backend..."
dotnet build
if [ $? -ne 0 ]; then
    echo "Error: Backend build failed."
    cleanup
fi

echo "Running backend at $BACKEND_APP_URL..."
dotnet run --urls "$BACKEND_APP_URL" &> ../backend.log &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID. Check 'backend.log' for logs."
cd .. 

echo "Waiting 15 seconds for the backend to initialize..."
sleep 15

echo "3. Starting the React frontend..."
cd "$FRONTEND_DIR" || { echo "Error: Frontend directory not found."; cleanup; }

if [ ! -d "node_modules" ]; then
  echo "Installing npm dependencies (this might take a while)..."
  npm install
  if [ $? -ne 0 ]; then
      echo "Error: Failed to install npm dependencies. Check console for details."
      cleanup
  fi
fi


echo "Running frontend at $FRONTEND_APP_URL..."
npm start &> ../frontend.log &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID. Check 'frontend.log' for logs."
cd .. 

echo "--- Application Started Successfully ---"
echo "Backend: $BACKEND_APP_URL"
echo "Frontend: $FRONTEND_APP_URL"
echo "Press Ctrl+C to stop both processes and clean up."

wait "$BACKEND_PID"
wait "$FRONTEND_PID"

cleanup 