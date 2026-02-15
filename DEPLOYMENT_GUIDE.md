# Robitro Platform - Deployment Guide

This guide will help you deploy the Robitro platform (frontend + backend) to a cloud hosting panel.

## Prerequisites

- Access to a hosting panel (cPanel, Plesk, CloudPanel, etc.)
- Node.js support on your hosting (v18 or higher)
- PostgreSQL database (Neon DB is already configured)
- Domain name pointed to your hosting

## Deployment Steps

### 1. Build the Frontend

First, build the production version of your React frontend:

```bash
cd /Users/webotapppvtltd/node_projects/robotics/client
npm run build
```

This will create a `dist` folder with optimized production files.

### 2. Prepare the Backend

The backend doesn't need building, but ensure all dependencies are installed:

```bash
cd /Users/webotapppvtltd/node_projects/robotics/server
npm install --production
```

### 3. Upload Files to Server

#### Option A: Using File Manager (cPanel/Plesk)

1. **Upload Backend:**
   - Compress the entire `server` folder into a ZIP file
   - Upload to your hosting (e.g., `/home/yourusername/robotics-backend/`)
   - Extract the ZIP file on the server

2. **Upload Frontend:**
   - Compress the `client/dist` folder into a ZIP file
   - Upload to your public_html or web root directory
   - Extract the ZIP file

#### Option B: Using FTP/SFTP

1. Connect to your server using FileZilla or similar FTP client
2. Upload the `server` folder to a directory outside public_html (e.g., `/home/yourusername/robotics-backend/`)
3. Upload the contents of `client/dist` to your `public_html` folder

#### Option C: Using Git (Recommended)

```bash
# On your server, clone the repository
cd /home/yourusername/
git clone <your-git-repo-url> robotics

# Build frontend on server
cd robotics/client
npm install
npm run build

# Install backend dependencies
cd ../server
npm install --production
```

### 4. Configure Environment Variables

Create a `.env` file in your server directory with:

```env
# Server Configuration
PORT=5001
NODE_ENV=production

# Database (Neon PostgreSQL)
DATABASE_URL=your_neon_database_url_here

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Frontend URL
CLIENT_URL=https://yourdomain.com

# CORS Origin
CORS_ORIGIN=https://yourdomain.com
```

**Important:** Update these values:
- `DATABASE_URL`: Your Neon database connection string
- `JWT_SECRET`: Generate a strong random secret
- `CLIENT_URL` and `CORS_ORIGIN`: Your actual domain

### 5. Set Up the Backend Server

#### Using Node.js App Manager (cPanel/CloudPanel)

1. Go to your hosting panel's Node.js application manager
2. Create a new Node.js application:
   - **Application Root:** `/home/yourusername/robotics-backend/server`
   - **Application URL:** `api.yourdomain.com` or `yourdomain.com/api`
   - **Application Startup File:** `server.js`
   - **Node.js Version:** 18.x or higher
3. Set environment variables in the panel
4. Start the application

#### Using PM2 (If you have SSH access)

```bash
# Install PM2 globally
npm install -g pm2

# Start the backend
cd /home/yourusername/robotics/server
pm2 start server.js --name robitro-api

# Save PM2 configuration
pm2 save

# Set PM2 to start on server reboot
pm2 startup
```

### 6. Configure Nginx/Apache Reverse Proxy

#### For Nginx:

Create a configuration file `/etc/nginx/sites-available/robitro`:

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /home/yourusername/public_html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if using same domain)
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/robitro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### For Apache (.htaccess):

Create `.htaccess` in your public_html:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Proxy API requests
  RewriteRule ^api/(.*)$ http://localhost:5001/api/$1 [P,L]
  
  # Frontend routing
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 7. Update Frontend API URL

Update the API URL in your frontend configuration:

**File:** `client/src/services/api.js`

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://api.yourdomain.com/api';
// or if using same domain: 'https://yourdomain.com/api'
```

Create `client/.env.production`:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

Then rebuild the frontend:

```bash
cd client
npm run build
```

### 8. Run Database Migrations

On the server, run Prisma migrations:

```bash
cd /home/yourusername/robotics/server
npx prisma migrate deploy
npx prisma generate
```

### 9. Set Up SSL Certificate

#### Using Let's Encrypt (Free):

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal is set up automatically
```

#### Using cPanel:

1. Go to SSL/TLS section
2. Use AutoSSL or install Let's Encrypt
3. Enable SSL for your domains

### 10. Test the Deployment

1. Visit `https://yourdomain.com` - Frontend should load
2. Visit `https://api.yourdomain.com/api/health` - Should return `{"success":true,"message":"Server is running"}`
3. Test login functionality
4. Test admin panel at `https://yourdomain.com/admin`

## Quick Deployment Checklist

- [ ] Build frontend (`npm run build`)
- [ ] Upload backend files to server
- [ ] Upload frontend dist files to public_html
- [ ] Create `.env` file with correct values
- [ ] Install backend dependencies (`npm install --production`)
- [ ] Run database migrations (`npx prisma migrate deploy`)
- [ ] Start Node.js application (PM2 or hosting panel)
- [ ] Configure reverse proxy (Nginx/Apache)
- [ ] Set up SSL certificate
- [ ] Update frontend API URL
- [ ] Test all functionality

## Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:** Check DATABASE_URL in .env file, ensure Neon database is accessible from your server IP

### Issue: "API calls failing"
**Solution:** 
- Check CORS settings in backend
- Verify API URL in frontend matches your backend URL
- Check reverse proxy configuration

### Issue: "404 on page refresh"
**Solution:** Ensure .htaccess or Nginx config has proper routing for SPA

### Issue: "Admin panel not loading"
**Solution:** 
- Check if admin routes are properly configured
- Verify authentication is working
- Check browser console for errors

## Updating the Application

### Update Backend:
```bash
cd /home/yourusername/robotics/server
git pull origin main
npm install
npx prisma migrate deploy
pm2 restart robitro-api
```

### Update Frontend:
```bash
cd /home/yourusername/robotics/client
git pull origin main
npm install
npm run build
# Copy dist files to public_html
cp -r dist/* /home/yourusername/public_html/
```

## Performance Optimization

1. **Enable Gzip Compression** in Nginx/Apache
2. **Set up CDN** for static assets (Cloudflare)
3. **Enable caching** for static files
4. **Use PM2 cluster mode** for backend:
   ```bash
   pm2 start server.js -i max --name robitro-api
   ```

## Monitoring

### Using PM2:
```bash
# View logs
pm2 logs robitro-api

# Monitor resources
pm2 monit

# View status
pm2 status
```

## Support

For issues or questions:
- Check server logs: `pm2 logs robitro-api`
- Check Nginx/Apache error logs
- Verify database connection
- Check environment variables

---

**Last Updated:** February 2026
**Platform Version:** 1.0.0
