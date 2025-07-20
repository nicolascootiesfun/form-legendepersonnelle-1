# Development Setup Guide

## Prerequisites

Before you can run this project, you need to install the following:

### 1. Node.js and npm

Download and install Node.js (version 18 or higher) from: https://nodejs.org/

After installation, verify by running:
```bash
node --version
npm --version
```

### 2. Git (optional but recommended)

Download from: https://git-scm.com/download/win

## Project Setup

### 1. Install Dependencies

Open a terminal in the project directory and run:
```bash
npm install
```

### 2. Environment Configuration

1. Copy the environment template:
```bash
copy .env.local.example .env.local
```

2. Edit `.env.local` and add your actual API keys and URLs:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# N8N Webhooks
N8N_WEBHOOK_BASE_URL=https://your-n8n-instance.com
N8N_IMAGE_GENERATION_WEBHOOK=https://your-n8n-instance.com/webhook/image-generation
N8N_FILE_UPLOAD_WEBHOOK=https://your-n8n-instance.com/webhook/file-upload
N8N_STORY_GENERATION_WEBHOOK=https://your-n8n-instance.com/webhook/story-generation

# Brevo API
BREVO_API_KEY=your_brevo_api_key

# WordPress API
WORDPRESS_API_BASE_URL=https://your-wordpress-site.com/wp-json

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the SQL commands from the README.md file to create the required tables

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Common Issues

### Port Already in Use

If port 3000 is already in use, you can run on a different port:
```bash
npm run dev -- -p 3001
```

### Module Not Found Errors

If you see module not found errors, try:
```bash
# Delete node_modules and reinstall
rmdir /s /q node_modules
npm install
```

### Environment Variables Not Loading

Make sure:
- The `.env.local` file is in the root directory
- Variable names are exactly as shown
- No spaces around the `=` sign
- Restart the dev server after changing env variables

## Testing the Application

### 1. Email Confirmation Flow

1. Navigate to http://localhost:3000
2. You should see a message about email confirmation
3. To bypass for development, use: http://localhost:3000?token=test123&email=test@example.com

### 2. Form Flow Testing

Test each step of the form:
1. **Welcome**: Enter child's name and age
2. **Contact**: Enter email and phone
3. **Child Info**: Test personality traits and file upload
4. **Image Generation**: This requires N8N webhook to be configured
5. **Characters**: Add additional characters
6. **Story Style**: Select a style
7. **Theme**: Select theme and submit

### 3. API Endpoints

Test the API routes:
- POST `/api/brevo/send-confirmation`
- POST `/api/generate-image`
- POST `/api/generate-story`

## Production Deployment

See the README.md for Docker and Coolify deployment instructions.
