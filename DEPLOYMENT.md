# CG FUN Companion App - Deployment Guide

## Frontend (Already Deployed)

**Platform**: Netlify
**URL**: https://cg-fun-companion.netlify.app
**Status**: ✅ Live

## Backend (Ready to Deploy)

**Important**: Socket.io requires persistent connections, so serverless functions won't work well.

**Recommended Platforms**:
1. **Render** (Free tier available) ⭐ BEST OPTION
2. **Railway** (Free tier available)
3. **Fly.io** (Free tier available)
4. **Heroku** (Paid tier)

### Quick Deployment to Render

1. **Push to GitHub**:
```bash
git push origin main
```

2. **Go to Render.com**:
   - Sign up/login
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `server` directory as the root

3. **Configure**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: `production`

4. **Deploy** and get your backend URL (e.g., `https://cg-fun-server.onrender.com`)

### Update Frontend with Backend URL

After backend is deployed:

1. **Create `.env.production` in frontend root**:
```
REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
```

2. **Rebuild and redeploy frontend**:
```bash
npm run build
netlify deploy --prod --dir=build
```

## Testing

1. Open https://cg-fun-companion.netlify.app
2. Create a room
3. Join with another user
4. Test trivia, moments, and active sessions

## Troubleshooting

### Backend Connection Issues
- Check that `REACT_APP_SOCKET_URL` matches your deployed backend URL
- Ensure backend is running and accessible
- Check browser console for connection errors

### CORS Issues
- Backend has CORS enabled for all origins
- If issues persist, update CORS settings in `server/server.js`

### File Upload Issues
- Backend stores uploads in `/public/uploads`
- Ensure write permissions on server
- For production, consider using cloud storage (AWS S3, etc.)

## Production Recommendations

1. **Use a database** instead of in-memory storage for rooms and moments
2. **Add authentication** for security
3. **Use cloud storage** (AWS S3, Cloudinary) for file uploads
4. **Add rate limiting** to prevent abuse
5. **Monitor server logs** and performance
6. **Set up SSL/TLS** (automatic on Render/Netlify)
