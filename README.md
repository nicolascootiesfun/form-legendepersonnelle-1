# Therapeutic Story Generation Form

A modern, responsive Next.js application for creating personalized therapeutic stories for children. The multi-step form collects child information and preferences to generate unique, therapeutic narratives.

## Features

- 🎨 Modern, child-friendly UI with custom color scheme
- 📱 Fully responsive design
- 💾 Auto-save functionality with Supabase integration
- 🖼️ AI-powered hero image generation
- 📧 Email confirmation with Brevo
- 🔄 Real-time form validation
- 📤 File uploads with drag-and-drop support
- 🌐 WordPress media integration via N8N

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **File Uploads**: React Dropzone
- **Email Service**: Brevo
- **Automation**: N8N webhooks
- **Deployment**: Coolify-compatible standalone build

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd therapeutic-story-form
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables template:
```bash
cp .env.local.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# N8N Webhooks
N8N_WEBHOOK_BASE_URL=your_n8n_webhook_base_url
N8N_IMAGE_GENERATION_WEBHOOK=your_n8n_image_generation_webhook
N8N_FILE_UPLOAD_WEBHOOK=your_n8n_file_upload_webhook
N8N_STORY_GENERATION_WEBHOOK=your_n8n_story_generation_webhook

# Brevo
BREVO_API_KEY=your_brevo_api_key

# WordPress
WORDPRESS_API_BASE_URL=your_wordpress_api_base_url

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Setup

Run the following SQL in your Supabase dashboard to create the required tables:

```sql
-- User sessions and tokens
CREATE TABLE user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  token text UNIQUE NOT NULL,
  validated boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- Form data storage
CREATE TABLE form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id uuid REFERENCES user_sessions(id),
  step_number integer,
  form_data jsonb,
  updated_at timestamp DEFAULT now()
);

-- Generated images tracking
CREATE TABLE generated_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id uuid REFERENCES user_sessions(id),
  image_url text,
  image_type text,
  status text DEFAULT 'pending',
  created_at timestamp DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_form_submissions_session ON form_submissions(user_session_id);
CREATE INDEX idx_generated_images_session ON generated_images(user_session_id);
```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Form Structure

The form consists of 7 steps:

1. **Welcome**: Child's name and age
2. **Contact**: Parent's email and phone
3. **Child Info**: Personality traits, photo, and descriptions
4. **Hero Image**: AI-generated character image
5. **Characters**: Additional story characters
6. **Story Style**: Visual story theme selection
7. **Theme**: Story topic and specific challenges

## N8N Webhook Integration

The application expects the following N8N webhooks:

### Image Generation Webhook
- **Endpoint**: `N8N_IMAGE_GENERATION_WEBHOOK`
- **Method**: POST
- **Payload**:
```json
{
  "imageRecordId": "uuid",
  "sessionId": "uuid",
  "childData": {
    "name": "string",
    "age": "number",
    "personalityTraits": ["array"],
    "physicalDescription": "string",
    "additionalCharacteristics": "string"
  }
}
```

### Story Generation Webhook
- **Endpoint**: `N8N_STORY_GENERATION_WEBHOOK`
- **Method**: POST
- **Payload**: Complete form data

## Deployment

### Build for production:

```bash
npm run build
```

### Coolify Deployment

The application is configured for standalone output, compatible with Coolify:

1. Push to your Git repository
2. Create new application in Coolify
3. Set environment variables
4. Deploy

### Docker Deployment

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

## Security Considerations

- All form inputs are validated and sanitized
- File uploads are restricted by type and size
- API endpoints use proper authentication
- Sensitive data is never exposed to the client
- HTTPS is enforced in production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@fabluo.com or create an issue in the repository.
