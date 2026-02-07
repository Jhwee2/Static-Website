// Configuration - Update this with your API Gateway URL
const API_GATEWAY_URL = "https://i0s3aejbi2.execute-api.us-east-1.amazonaws.com/prod/chat";

// DOM Elements - Will be initialized when page loads
let chatWidget;
let messagesDiv;
let userInput;
let sendBtn;
let terminalContent;
let terminalScrollArea;

// --- SMOOTH SCROLL FOR NAVIGATION ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// --- CHATBOT LOGIC ---

function toggleChat() {
    if (chatWidget.classList.contains('hidden')) {
        chatWidget.classList.remove('hidden');
        chatWidget.classList.add('flex');
        setTimeout(() => userInput.focus(), 100);
    } else {
        chatWidget.classList.add('hidden');
        chatWidget.classList.remove('flex');
    }
}

function handleKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}

function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `chat-bubble ${sender}`;
    div.innerHTML = text.replace(/\n/g, '<br>');
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // UI Updates
    appendMessage(text, 'user');
    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;

    // Loading Indicator
    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-bubble agent animate-pulse';
    loadingDiv.id = loadingId;
    loadingDiv.innerText = "Processing query...";
    messagesDiv.appendChild(loadingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
        const response = await fetch(API_GATEWAY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById(loadingId).remove();

        // Handle different possible response formats
        const botReply = data.reply || data.response || data.message || data.body;

        if (botReply) {
            appendMessage(botReply, 'agent');
        } else {
            console.log('Unexpected response format:', data);
            appendMessage("I received a response but couldn't parse it. Check the console for details.", 'agent');
        }

    } catch (err) {
        console.error('Chatbot error:', err);
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();
        appendMessage(`System Error: ${err.message}`, 'agent');
    }

    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
}

// --- RESUME / TERMINAL LOGIC ---

const experienceData = {
    healthfirst: `
<span class="syntax-keyword">class</span> <span class="text-yellow-300">Healthfirst</span>(ProductOwner):
    <span class="syntax-keyword">def</span> <span class="syntax-func">execute_strategy</span>(self):
        <span class="syntax-comment"># Automation & Enterprise Migration</span>
        savings = <span class="syntax-keyword">await</span> system.migrate_and_automate(
            target=<span class="syntax-string">"Enterprise_System"</span>,
            workflow=<span class="syntax-string">"Correspondence"</span>
        )
        <span class="syntax-keyword">return</span> savings <span class="syntax-comment"># Result: $200k annual savings</span>

<span class="text-indigo-400">>> Running impact analysis...</span><br><br>

<span class="text-white text-xl font-bold border-b border-gray-600 pb-1 mb-2 inline-block">Healthfirst</span>
<br>
• Secured $200,000 in documented annual departmental savings by leading the strategic migration to a new enterprise system.
<br><br>
• Drove strategic prioritization for the Product Backlog using data and stakeholder input.
<br><br>
• Improved team execution by crafting precise Gherkin user stories and acceptance criteria.
        `,
    nys: `
<span class="syntax-keyword">import</span> servicenow_sdk <span class="syntax-keyword">as</span> snow

<span class="syntax-keyword">def</span> <span class="syntax-func">automate_workflow</span>(user_feedback):
    complaints = snow.analytics.get_complaints()
    <span class="syntax-keyword">if</span> automation_enabled:
        complaints -= <span class="text-orange-300">0.35</span> <span class="syntax-comment"># Reduced by 35%</span>
    <span class="syntax-keyword">return</span> <span class="syntax-string">"Success"</span>

<span class="text-indigo-400">>> Fetching project logs...</span><br><br>

<span class="text-white text-xl font-bold border-b border-gray-600 pb-1 mb-2 inline-block">NYS Office of ITS</span>
<br>
• Orchestrated 10+ WebEx meetings with internal and external end-users to define project scope.
<br><br>
• Leveraged JavaScript to develop scripts on ServiceNow to automate approvals reducing users' complaints 35%.
        `,
    unadat: `
<span class="syntax-keyword">def</span> <span class="syntax-func">launch_product</span>():
    app = Project(name=<span class="syntax-string">"Chores"</span>, type=<span class="syntax-string">"FinTech"</span>)
    <span class="syntax-keyword">while</span> app.in_development:
        Scrum.daily_standup(team_size=5)

<span class="text-indigo-400">>> Initializing Internship module...</span><br><br>

<span class="text-white text-xl font-bold border-b border-gray-600 pb-1 mb-2 inline-block">Unadat</span>
<br>
• Collaborated with a team of 5 software engineers by setting user stories on JIRA.
<br><br>
• Planned, designed, and implemented a web application called "Chores" to expand target demographic to youth.
        `,
    mta: `
<span class="syntax-keyword">SELECT</span> * <span class="syntax-keyword">FROM</span> financial_reports;
<span class="syntax-keyword">UPDATE</span> workflows <span class="syntax-keyword">SET</span> status = <span class="syntax-string">'Automated'</span>;

<span class="text-indigo-400">>> Querying Data Warehouse...</span><br><br>

<span class="text-white text-xl font-bold border-b border-gray-600 pb-1 mb-2 inline-block">MTA</span>
<br>
• Constructed RDBMS using SQL on MS Access to generate financial analytical reports.
<br><br>
• Automated 4+ workflow activities by developing macros in Access, Office Power Automate, and Excel.
        `
};

let currentTypingTimeout;

function loadExperience(companyKey) {
    // Reset Visuals
    document.querySelectorAll('.exp-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${companyKey}`);
    if (activeBtn) activeBtn.classList.add('active');

    // Reset Terminal
    if (currentTypingTimeout) clearTimeout(currentTypingTimeout);
    terminalContent.innerHTML = '';

    // Start Typing
    typeWriter(experienceData[companyKey], 0);
}

function typeWriter(html, index) {
    if (index < html.length) {
        if (html.charAt(index) === '<') {
            let endIndex = html.indexOf('>', index);
            terminalContent.innerHTML += html.slice(index, endIndex + 1);
            index = endIndex + 1;
        } else {
            terminalContent.innerHTML += html.charAt(index);
            index++;
        }
        terminalScrollArea.scrollTop = terminalScrollArea.scrollHeight;
        currentTypingTimeout = setTimeout(() => typeWriter(html, index), 2);
    }
}

// Initialize when page loads
window.onload = function() {
    // Initialize DOM elements
    chatWidget = document.getElementById('chat-widget');
    messagesDiv = document.getElementById('chat-messages');
    userInput = document.getElementById('user-input');
    sendBtn = document.getElementById('send-btn');
    terminalContent = document.getElementById('terminal-content');
    terminalScrollArea = document.getElementById('terminal-scroll-area');

    // Load first experience
    loadExperience('healthfirst');
};
