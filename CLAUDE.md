# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static personal portfolio website for Jared Hwee, an AI Product Owner. The site features:
- Interactive resume with terminal-style UI and typewriter effects
- AI chatbot integration via AWS API Gateway
- Responsive design using Tailwind CSS
- Dark theme with gradient effects and animations

## Technology Stack

- **Frontend**: Pure HTML, CSS, and JavaScript (no build step required)
- **Styling**: Tailwind CSS (CDN)
- **Fonts**: Google Fonts (Inter, Fira Code)
- **Backend**: AWS API Gateway + Lambda (for chatbot)
- **Hosting**: AWS Amplify (noted in footer)
- **Version Control**: Git/GitHub

## File Structure

- `index.html` (13KB) - Main HTML structure with semantic markup (hero, work experience, contact, chatbot widget)
- `script.js` (8KB) - All JavaScript functionality (smooth scrolling, terminal typewriter effect, chatbot API calls)
- `style.css` (2KB) - Custom CSS styles (animations, scrollbars, syntax highlighting, chat bubbles)
- `image.jpg` - Profile or hero image asset

## Key Architecture Patterns

### 1. Terminal/Code Display System
The work experience section simulates a code editor terminal with:
- **Experience Data Object** (`experienceData` in script.js:96-160): Contains Python/SQL-like code snippets with syntax highlighting for each role
- **Typewriter Effect** (`typeWriter` function in script.js:178-191): Character-by-character rendering that preserves HTML tags
- **Button State Management** (`loadExperience` function in script.js:164-176): Handles active button styling and content switching
- **Auto-scroll**: Terminal scrolls automatically as content types

### 2. AI Chatbot Widget
- **Toggle Mechanism** (`toggleChat` function in script.js:24-33): Fixed bottom-right button shows/hides chat widget
- **API Integration**: Sends POST requests to `API_GATEWAY_URL` (script.js:2) with `{ message: text }` payload
- **Response Handling**: Expects `{ reply: string }` from backend
- **Message Bubbles**: User messages styled differently from agent responses (styles in style.css:75-97)
- **Loading States**: Shows "Processing query..." while waiting for API response

### 3. External File Architecture
The codebase follows a clean separation of concerns:
- **HTML** (index.html): Semantic structure only, no inline styles or scripts
- **CSS** (style.css): All custom styling including animations, scrollbars, and theme colors
- **JavaScript** (script.js): All interactive functionality and data

## Important Configuration

### AWS API Gateway URL
Located at `script.js:2`:
```javascript
const API_GATEWAY_URL = "https://i0s3aejbi2.execute-api.us-east-1.amazonaws.com/prod/chat";
```

**When updating the chatbot backend**, change this URL in script.js to point to the new API Gateway endpoint.

## AWS Backend Architecture

### API Gateway + Lambda Integration
The chatbot uses a serverless backend:

**Request Format:**
```javascript
POST https://i0s3aejbi2.execute-api.us-east-1.amazonaws.com/prod/chat
Content-Type: application/json

{
  "message": "user's question here"
}
```

**Expected Response Format:**
The Lambda function must return one of these formats:
```json
{ "reply": "bot response" }
// OR
{ "response": "bot response" }
// OR
{ "message": "bot response" }
// OR
{ "body": "bot response" }
```

The frontend (script.js:81) handles all four formats for flexibility.

### Lambda Function Requirements

**Critical Requirements:**
1. **CORS Headers**: Must include in every response:
   ```python
   'Access-Control-Allow-Origin': '*'
   'Access-Control-Allow-Headers': 'Content-Type'
   'Access-Control-Allow-Methods': 'OPTIONS,POST'
   ```

2. **Response Structure**:
   ```python
   {
       'statusCode': 200,
       'headers': { /* CORS headers */ },
       'body': json.dumps({ 'reply': 'response text' })
   }
   ```

3. **Error Handling**: Return 500 status with CORS headers on errors

**Common Issues:**
- **502 Bad Gateway**: Lambda function is crashing or timing out
- **Failed to fetch**: CORS not configured on API Gateway or Lambda
- **403 Forbidden**: API Gateway authentication/authorization issues
- Check CloudWatch Logs for Lambda execution errors

### Deploying Backend Changes
1. Update Lambda function code in AWS Console
2. Click "Deploy" in Lambda
3. Enable CORS on API Gateway (Actions → Enable CORS)
4. **Deploy API to prod stage** (Actions → Deploy API)
5. Wait 10-20 seconds for changes to propagate

## Development Workflow

### Local Development
Since this is a static site with no build process:
1. Open `index.html` directly in a browser, OR
2. Use any local HTTP server:
   ```bash
   python -m http.server 8000
   # OR
   npx http-server
   ```
3. Navigate to `http://localhost:8000`

### Testing the Chatbot
The chatbot requires the AWS backend (Lambda + API Gateway) to be running.

**Testing Steps:**
1. Open browser DevTools (F12) before testing
2. Click the chatbot button in bottom-right corner
3. Send a test message
4. Check Console tab for detailed error messages

**Common Error Messages:**
- `"Failed to fetch"` → CORS issue (API Gateway or Lambda)
- `"HTTP error! status: 502"` → Lambda function crashing
- `"HTTP error! status: 403"` → API Gateway authorization issue
- `"System Error: Unable to reach the agent"` → Network/connectivity issue

**Testing the API directly:**
```bash
curl -X POST https://i0s3aejbi2.execute-api.us-east-1.amazonaws.com/prod/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```
If curl works but browser doesn't → CORS configuration issue

### Making Content Changes

**To update work experience content:**
- Edit the `experienceData` object in `script.js` (lines 96-160)
- Add/modify company buttons in `index.html` (lines 139-173)
- Ensure button `onclick` attributes match the keys in `experienceData`

**To modify the chatbot prompt or behavior:**
- Update the initial greeting message in `index.html` (around line 165)
- Change API integration logic in `script.js` (sendMessage function)
- Modify the backend Lambda function (not in this repo)

**To change styling:**
- Custom styles are in `style.css` (animations, scrollbars, syntax highlighting, chat bubbles)
- Tailwind utility classes are used in `index.html`
- Keep the visual design consistent - avoid major layout changes

## Git Workflow

Repository: https://github.com/Jhwee2/Static-Website.git

When committing changes:
- Focus on user-facing changes in commit messages
- Test chatbot functionality if HTML/JavaScript was modified
- Ensure responsive design still works on mobile viewports

## Deployment

### AWS Amplify Hosting
The site is hosted on AWS Amplify (referenced in index.html footer).

**Deployment Process:**
1. Push changes to GitHub main branch
2. AWS Amplify automatically detects changes
3. Amplify builds and deploys (no build step needed for static site)
4. Changes are live within 1-2 minutes

**Manual Deployment (if needed):**
1. Go to AWS Amplify Console
2. Select the app
3. Click "Run build" to manually trigger deployment

**Important Notes:**
- Changes to `script.js` API_GATEWAY_URL require redeployment
- Test locally before pushing to main branch
- AWS Amplify serves files directly (no server-side rendering)

## Code Style Notes

- **JavaScript**: ES6+ syntax (async/await, arrow functions, template literals)
- **Event Handling**: Mix of inline handlers (`onclick`, `onkeypress`) in HTML and addEventListener in JS
- **CSS**: Tailwind utility-first approach with custom classes for animations and theme-specific styling
- **Syntax Highlighting**: Custom CSS classes in style.css (`.syntax-keyword`, `.syntax-func`, `.syntax-string`, `.syntax-comment`)
- **File Organization**: Clean separation - HTML for structure, CSS for styling, JS for behavior
