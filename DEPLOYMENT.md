# Deployment to Railway

## Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub account with this repository pushed
- OpenRouter API key (https://openrouter.ai/keys)
- Claude API key (https://console.anthropic.com/)

## Step 1: Push to GitHub

```bash
cd C:\Repos\symbols-ai-platform
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

## Step 2: Connect to Railway

1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select the `symbols-ai-platform` repository
6. Select the `chat` directory as the root directory

## Step 3: Configure Environment Variables

In the Railway dashboard:

1. Go to your project settings
2. Click "Variables"
3. Add the following environment variables:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `CLAUDE_API_KEY`: Your Claude API key

## Step 4: Deploy

Railway will automatically build and deploy your app when you push to GitHub.

### Manual Deploy
If you want to deploy manually:
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Link project: `railway link`
4. Deploy: `railway up`

## Step 5: Access Your App

Once deployed, Railway will provide you with a public URL. Your Symbols AI Platform will be live!

## Troubleshooting

### Build fails
- Check that `package.json` has all required dependencies
- Ensure `next.config.ts` is valid
- Check build logs in Railway dashboard

### App crashes
- Check logs in Railway dashboard
- Verify environment variables are set correctly
- Ensure API keys are valid

### Slow performance
- Railway provides generous free tier resources
- For production, consider upgrading to paid plan
- Monitor resource usage in Railway dashboard

## Notes

- The app uses Next.js 16 with React 19
- MCP server (symbols-mcp) runs locally and connects via stdio
- API keys can be set in Railway environment variables or provided in the UI
- The app generates Symbols/DOMQL v3 projects in the `output/` directory
