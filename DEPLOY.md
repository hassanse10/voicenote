# Deploy VoiceNote to Vercel

## Option 1: GitHub Auto-Deploy (Recommended)

### Step 1: Initialize Git & Push to GitHub
```bash
cd "C:\Users\HASSAN\App2\audio to text"
git init
git add .
git commit -m "Initial commit: VoiceNote app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/voicenote.git
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in
3. Click **"New Project"**
4. Select your GitHub repository: `voicenote`
5. Click **"Import"**

### Step 3: Add Environment Variables
1. In Vercel dashboard, go to **Settings → Environment Variables**
2. Add:
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `sk-or-v1-...` (your OpenRouter key)
3. Click **"Save"**

### Step 4: Deploy
Click **"Deploy"** — Vercel will automatically build & deploy your app.

**Your live URL**: `https://voicenote-XXXX.vercel.app`

---

## Option 2: Vercel CLI (Quick Deploy)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd "C:\Users\HASSAN\App2\audio to text"
vercel
```

Follow the prompts. When asked about environment variables, add:
- `OPENROUTER_API_KEY`: your key

### Step 4: Add to Git (Optional)
```bash
vercel link
```

This links the project to Vercel so future `git push` auto-deploys.

---

## Testing After Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Hold the microphone button and speak
3. Click "✏️ Grammar", "📝 Summary", or "🗂️ Format" to test AI features
4. Check browser console (F12) for any errors

---

## Troubleshooting

### API calls return 404
- Make sure `OPENROUTER_API_KEY` is set in Vercel Environment Variables
- Check Vercel logs: **Deployments → Latest → Logs**

### "Speech recognition not supported"
- Use Chrome, Firefox, Safari, or Edge (not IE)
- Speech API requires HTTPS (Vercel provides this by default)

### Slow AI responses
- First API call after deployment may take 10-15s (cold start)
- Subsequent calls are faster (cached connections)
