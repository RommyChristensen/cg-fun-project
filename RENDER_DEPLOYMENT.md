# Deploy Backend to Render (Recommended)

Render is the best option for deploying your Node.js backend with Socket.io support.

## Step-by-Step Guide

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 3. Create a New Web Service

1. Click **"New +"** → **"Web Service"**
2. Select your GitHub repository
3. Choose the repository and branch (main)

### 4. Configure the Service

Fill in the following settings:

- **Name**: `cg-fun-server`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free (or Starter for better performance)

### 5. Add Environment Variables

Click **"Advanced"** and add:

```
NODE_ENV = production
PORT = (leave empty, Render assigns it)
```

### 6. Deploy

Click **"Create Web Service"** and wait for deployment to complete.

Your backend URL will be: `https://cg-fun-server.onrender.com`

## Update Frontend

After backend is deployed:

### 1. Create `.env.production` in frontend root:

```
REACT_APP_SOCKET_URL=https://cg-fun-server.onrender.com
```

### 2. Rebuild and redeploy:

```bash
npm run build
netlify deploy --prod --dir=build
```

## Important Notes

- **Free tier**: Render spins down inactive services after 15 minutes
- **Paid tier**: Recommended for production ($7/month)
- **Uploads**: Files are stored in `/tmp/uploads` (temporary, will be lost on redeploy)
- **For production**: Use cloud storage like AWS S3 or Cloudinary

## Troubleshooting

### Backend not connecting
- Check that `REACT_APP_SOCKET_URL` matches your Render URL exactly
- Ensure no trailing slashes
- Check browser console for connection errors

### Uploads not persisting
- Free tier doesn't have persistent storage
- Upgrade to paid tier or use cloud storage

### Service keeps spinning down
- Upgrade to paid tier for always-on service

## Next Steps

1. Deploy backend to Render
2. Update frontend with backend URL
3. Redeploy frontend to Netlify
4. Test the full application
