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
const API_GATEWAY_URL = "https://acxnljxubg.execute-api.us-east-1.amazonaws.com/prod";
```

**When updating the chatbot backend**, change this URL in script.js to point to the new API Gateway endpoint.

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
The chatbot requires the AWS backend to be running. To test locally without the backend:
- The chatbot will show "System Error: Unable to reach the agent" if the API is unreachable
- Check browser console for fetch errors
- Verify the API_GATEWAY_URL is correct and CORS is configured

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

## Code Style Notes

- **JavaScript**: ES6+ syntax (async/await, arrow functions, template literals)
- **Event Handling**: Mix of inline handlers (`onclick`, `onkeypress`) in HTML and addEventListener in JS
- **CSS**: Tailwind utility-first approach with custom classes for animations and theme-specific styling
- **Syntax Highlighting**: Custom CSS classes in style.css (`.syntax-keyword`, `.syntax-func`, `.syntax-string`, `.syntax-comment`)
- **File Organization**: Clean separation - HTML for structure, CSS for styling, JS for behavior
