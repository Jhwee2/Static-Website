// --- Existing Smooth Scroll Code (Keep this) ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// --- NEW: Experience Terminal Logic ---

// 1. Define the Data (Your Resume Content)
const experienceData = {
    healthfirst: `
<span class="text-white font-bold">Role:</span> Product Owner
<span class="text-white font-bold">Location:</span> New York, NY
<span class="text-white font-bold">Period:</span> Sept 2023 - Present

<span class="text-blue-300">> parameters = { "efficiency": "high", "savings": 200000 }</span>
<span class="text-blue-300">> run_automation_protocol()</span>

• Secured $200,000 in documented annual departmental savings by leading the strategic migration to a new enterprise system and automating the full correspondence workflow.
• Drove strategic prioritization for the Product Backlog using data and stakeholder input to ensure alignment with the Product Goal and maximize ROI.
• Improved team execution by owning backlog refinement, crafting precise Gherkin user stories (Behavior Driven Development), and serving as the technical liaison for complex data integrations.
• Influenced the UX/UI design for a key internal web application, collaborating with business users to reduce agent friction and streamline the enrollment process by 17.3%.
    `,
    nys: `
<span class="text-white font-bold">Role:</span> ServiceNow Developer
<span class="text-white font-bold">Location:</span> New York, NY
<span class="text-white font-bold">Period:</span> Jun 2023 – Aug 2023

<span class="text-blue-300">> import automation_module</span>
<span class="text-blue-300">> execute_script(target="workflow")</span>

• Orchestrated 10+ WebEx meetings with internal and external end-users to define project scope and user stories.
• Leveraged JavaScript to develop scripts on ServiceNow to automate approvals, reducing user complaints by 35%.
• Worked with multiple teams to establish product backlog priority and improvements to user experience.
    `,
    unadat: `
<span class="text-white font-bold">Role:</span> Project Manager Intern
<span class="text-white font-bold">Location:</span> New York, NY
<span class="text-white font-bold">Period:</span> Jul 2022 – Aug 2022

<span class="text-blue-300">> initialize_project(name="Chores")</span>
<span class="text-blue-300">> analyze_market_fit()</span>

• Collaborated with a team of 5 software engineers by setting user stories on JIRA and hosted daily meetings.
• Researched personal finance tools to be deployed as web applications and presented them to C-suite executives.
• Planned, designed, and implemented a web application called "Chores" to expand target demographic to youth.
    `,
    mta: `
<span class="text-white font-bold">Role:</span> Data Analyst Intern
<span class="text-white font-bold">Location:</span> New York, NY
<span class="text-white font-bold">Period:</span> Mar 2022 – Jun 2022

<span class="text-blue-300">> SELECT * FROM financial_reports WHERE optimized = TRUE;</span>
<span class="text-blue-300">> connect_database()</span>

• Constructed RDBMS using SQL on MS Access to generate financial analytical reports for company leaders.
• Migrated 3+ Excel spreadsheets to a single database to visually display and create relationships between the data.
• Automated 4+ workflow activities by developing macros in Access, Office Power Automate, and Excel.
    `
};

// 2. Variables to manage the typing effect
let currentTypingTimeout;
const terminalContent = document.getElementById('terminal-content');

// 3. The Function to Load Experience
function loadExperience(companyKey) {
    // A. Update Buttons (Visual State)
    document.querySelectorAll('.exp-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-indigo-600', 'text-white', 'shadow-lg', 'border-indigo-400');
        btn.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800', 'border-transparent');
    });

    const activeBtn = document.getElementById(`btn-${companyKey}`);
    activeBtn.classList.add('active', 'bg-indigo-600', 'text-white', 'shadow-lg', 'border-indigo-400');
    activeBtn.classList.remove('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800', 'border-transparent');

    // B. Clear current text and stop any ongoing typing
    if (currentTypingTimeout) clearTimeout(currentTypingTimeout);
    terminalContent.innerHTML = '';

    // C. Start Typing Effect
    const textHTML = experienceData[companyKey];
    typeWriter(textHTML, 0);
}

// 4. The Typewriter Logic (Advanced: handles HTML tags)
function typeWriter(html, index) {
    if (index < html.length) {
        // If we encounter an HTML tag, append the whole tag instantly so we don't see raw code
        if (html.charAt(index) === '<') {
            let endIndex = html.indexOf('>', index);
            terminalContent.innerHTML += html.slice(index, endIndex + 1);
            index = endIndex + 1;
        } else {
            terminalContent.innerHTML += html.charAt(index);
            index++;
        }
        
        // Adjust speed here (lower number = faster)
        currentTypingTimeout = setTimeout(() => typeWriter(html, index), 5); 
    }
}

// 5. Initialize with the first job
window.onload = function() {
    loadExperience('healthfirst');
};

// Simple function to call your Agent
async function askJared() {
    const question = document.getElementById('userQuestion').value;
    const responseBox = document.getElementById('agentResponse');
    
    responseBox.innerText = "Thinking...";
    
    // REPLACE with your AWS Lambda Function URL
    const lambdaUrl = "https://r3zwzro2hyyjpe245p2nry7ycm0wtksm.lambda-url.us-east-1.on.aws/"; 

    try {
        const response = await fetch(lambdaUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question })
        });
        
        const data = await response.json();
        responseBox.innerText = data.answer;
    } catch (error) {
        responseBox.innerText = "Error contacting agent.";
        console.error(error);
    }
}