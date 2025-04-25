#!/bin/sh

# Create new Next.js project if package.json doesn't exist
if [ ! -f "/app/package.json" ]; then
    echo "No package.json found. Creating new Next.js project..."
    cd /app
    npx create-next-app@latest . \
        --typescript \
        --tailwind \
        --eslint \
        --app \
        --src-dir \
        --import-alias "@/*" \
        --no-git \
        --use-npm
fi

# Always install dependencies to ensure they are up to date
echo "Installing dependencies..."
cd /app && npm install --legacy-peer-deps

# Install Tailwind CSS and its peer dependencies if not already installed
echo "Ensuring Tailwind CSS and its dependencies are installed..."
cd /app && npm install -D tailwindcss postcss autoprefixer postcss-import --legacy-peer-deps

# Initialize Tailwind CSS if config doesn't exist
if [ ! -f "/app/tailwind.config.ts" ]; then
    echo "Initializing Tailwind CSS..."
    cd /app && npx tailwindcss init -p --ts
fi

# Start the application based on NODE_ENV
if [ "$NODE_ENV" = "production" ]; then
    echo "Starting in production mode..."
    cd /app && npm run build && npm start
else
    echo "Starting in development mode..."
    cd /app && npm run dev
fi 