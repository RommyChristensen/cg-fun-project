# CG FUN Companion App - Backend Server

Node.js/Express backend server for the CG FUN Companion App with Socket.io for real-time communication.

## Setup

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3001`

## Deployment

### Deploy to Render

1. Push your code to GitHub
2. Go to [Render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Set the following:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `PORT`: (leave empty, Render will set it)
     - `NODE_ENV`: `production`

6. Deploy!

Your backend URL will be something like: `https://cg-fun-server.onrender.com`

### Deploy to Heroku

1. Install Heroku CLI
2. Login to Heroku:
```bash
heroku login
```

3. Create a new app:
```bash
heroku create cg-fun-server
```

4. Deploy:
```bash
git push heroku main
```

Your backend URL will be: `https://cg-fun-server.herokuapp.com`

## API Endpoints

- `GET /health` - Health check
- `POST /upload` - Upload photo to moments
- `GET /api/moments` - Get all uploaded moments
- `GET /api/sessions` - Get all active game sessions

## Socket Events

- `create_room` - Create a new game room
- `join_room` - Join an existing room
- `start_trivia` - Start trivia game
- `answer_question` - Answer a trivia question
- `finish_game` - Finish the game
- `add_moment` - Add a photo to moments
- `get_moments` - Get moments for a room
- `get_all_moments` - Get all moments globally

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
