# Standub Website

A modern, responsive website for Standub - Music Producer & Performer.

## Features

- **Hero Section**: Banner image with overlapping circular profile picture
- **Social Links**: Instagram, Email, Spotify, Apple Music with hover effects
- **Video Gallery**: Customizable thumbnails with play buttons
- **About Section**: Styled bio with highlighted keywords
- **Red-ish Color Theme**: Inspired by beacons.ai/standub
- **Fully Responsive**: Works on mobile, tablet, and desktop
- **Accessible**: WCAG 2.1 AA compliant
- **Performance Optimized**: Minimal dependencies, optimized assets

## Project Structure

```
Website Standub/
├── index.html          # Main HTML file
├── styles.css          # All styles
├── script.js           # Interactive functionality
├── wrangler.toml       # Cloudflare Pages config
├── _headers            # HTTP headers for Cloudflare
├── _redirects          # URL redirects for Cloudflare
├── assets/
│   ├── images/         # Banner, profile, video thumbnails
│   ├── videos/         # Local video files (optional)
│   └── icons/          # Favicon, app icons
└── README.md           # This file
```

## Quick Start

### Local Development

1. Open `index.html` directly in a browser, OR
2. Use a local server:
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (if you have npx)
   npx serve .

   # PHP
   php -S localhost:8000
   ```

3. Visit `http://localhost:8000`

### Adding Your Content

#### Option A: Local Images (Default)
1. **Replace placeholder images** in `assets/images/`:
   - `banner.jpg` - Hero banner (recommended: 1920x600px, 16:5 aspect ratio)
   - `profile.jpg` - Profile picture (recommended: 400x400px, square)
   - `video-thumb-1.jpg`, `video-thumb-2.jpg`, `video-thumb-3.jpg` - Video thumbnails (16:9 aspect ratio)

#### Option B: Cloudflare R2 Object Storage (Recommended for Production)
1. **Create an R2 bucket** in Cloudflare Dashboard
2. **Enable public access** or set up a custom domain for the bucket
3. **Upload your images** to the bucket (e.g., `banner.jpg`, `profile.jpg`, `video-thumb-1.jpg`, etc.)
4. **Configure R2 in `script.js`**:
   ```javascript
   const CONFIG = {
       r2: {
           // Option 1: Use R2 public bucket URL
           baseUrl: 'https://pub-xxxxxxxxxxxxxxxxx.r2.dev',
           
           // Option 2: Use custom domain (recommended)
           // customDomain: 'https://media.standub.com'
       },
       // Image paths - just the filename if using R2
       bannerImage: 'banner.jpg',
       profileImage: 'profile.jpg',
       videos: [
           {
               thumbnail: 'video-thumb-1.jpg',
               // ...
           }
       ]
   };
   ```

2. **Update social links** in `script.js`:
   ```javascript
   const CONFIG = {
       socialLinks: {
           instagram: 'https://instagram.com/yourusername',
           email: 'mailto:your@email.com',
           spotify: 'https://open.spotify.com/artist/yourid',
           appleMusic: 'https://music.apple.com/artist/yourid'
       },
       // ... rest of config
   };
   ```

3. **Update video content** in `script.js`:
   ```javascript
   videos: [
       {
           id: 'video-1',
           title: 'Your Video Title',
           description: 'Video description',
           // If using R2, just use the filename
           thumbnail: 'your-thumb.jpg',
           // Or full URL if not using R2
           // thumbnail: 'assets/images/your-thumb.jpg',
           videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
           type: 'youtube' // or 'vimeo', 'local'
       },
       // ... more videos
   ]
   ```

### R2 Setup Details

**To set up Cloudflare R2 for your images:**

1. **Create R2 Bucket:**
   - Go to Cloudflare Dashboard → R2 → Create bucket
   - Name it (e.g., `standub-media`)

2. **Enable Public Access:**
   - In bucket settings → Public access → Allow access
   - Note the public URL (e.g., `https://pub-xxx.r2.dev`)

3. **Or Set Up Custom Domain (Recommended):**
   - In bucket settings → Custom domains → Add domain
   - Add `media.standub.com` (or your subdomain)
   - Configure DNS in Cloudflare

4. **Upload Images:**
   - Use Cloudflare Dashboard, AWS CLI, or tools like `rclone`
   - Example with AWS CLI:
     ```bash
     aws s3 cp banner.jpg s3://standub-media/ --endpoint-url https://<account-id>.r2.cloudflarestorage.com
     ```

5. **Configure CORS (if needed):**
   - In bucket settings → CORS policy:
     ```json
     [
       {
         "AllowedOrigins": ["*"],
         "AllowedMethods": ["GET", "HEAD"],
         "AllowedHeaders": ["*"],
         "MaxAgeSeconds": 3600
       }
     ]
     ```

6. **Update `script.js` with your R2 URL:**
   ```javascript
   r2: {
       // Use either baseUrl OR customDomain, not both
       baseUrl: 'https://pub-xxxxxxxxxxxxxxxxx.r2.dev',
       // OR
       // customDomain: 'https://media.standub.com'
   }
   ```

**Benefits of R2:**
- No egress fees
- Global CDN via Cloudflare
- Custom domain support
- S3-compatible API

## Deploy to Cloudflare Pages

### Option 1: Git Integration (Recommended)

1. Push this folder to a Git repository (GitHub, GitLab, Bitbucket)
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Click "Create a project" → "Connect to Git"
4. Select your repository
5. Configure build settings:
   - **Build command**: (leave empty)
   - **Build output directory**: `/` (root)
   - **Root directory**: `/` (or your project folder)
6. Click "Save and Deploy"

### Option 2: Direct Upload

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Click "Create a project" → "Upload assets"
3. Drag and drop the entire project folder
4. Click "Deploy"

### Option 3: Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy . --project-name=standub
```

## Custom Domain

1. In Cloudflare Pages dashboard, go to your project
2. Click "Custom domains" → "Set up a custom domain"
3. Enter your domain (e.g., `standub.com`)
4. Follow DNS configuration instructions

## Performance Tips

- **Images**: Compress with tools like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
- **Video thumbnails**: Use WebP format for smaller file sizes
- **Banner image**: Optimize for web (JPEG 80-85% quality, max 1920px wide)
- **Enable Cloudflare Polish** in Speed → Optimization for automatic image optimization

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- Semantic HTML5
- ARIA labels on interactive elements
- Focus visible states
- Reduced motion support
- High contrast mode support
- Keyboard navigation

## License

MIT License - Feel free to use and modify for your own projects.

---

**Need help?** Check the [Cloudflare Pages docs](https://developers.cloudflare.com/pages/) or open an issue.