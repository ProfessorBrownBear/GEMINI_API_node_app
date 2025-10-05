/**
 * Professor Brownbear’s Secret AI Model
 * -------------------------------------
 * A full-stack ExpressJS teaching lab demonstrating integration with
 * Google’s Gemini API. Designed for students learning API architecture,
 * asynchronous JavaScript, and front-end interaction patterns.
 *
 * Demonstrates:
 *  - Secure API key usage with dotenv
 *  - Async/await and fetch() in Node 22+
 *  - Retry logic with exponential backoff
 *  - Responsive HTML + Dark/Light theme toggle
 *
 * Author: Professor Brownbear (Peter Sigurdson)
 * License: MIT
 * Version: 1.2.0
 */

require("dotenv").config();           // Load environment variables from .env
const express = require("express");   // Web framework
const app = express();
const PORT = process.env.PORT || 3000;

// --- Gemini API Configuration -------------------------------------------------

const API_URL_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const MODEL_NAME = "gemini-2.5-flash";
const apiKey = process.env.GEMINI_API_KEY;

// Guard clause: stop server if API key missing
if (!apiKey) {
  console.error(`
⚠️  Missing GEMINI_API_KEY.
Create a .env file in your project root containing:
   GEMINI_API_KEY=your_actual_key_here
`);
  process.exit(1);
}

// --- Middleware ---------------------------------------------------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/assets", express.static("assets")); // Serve static images

// --- FRONTEND ROUTE -----------------------------------------------------------

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Professor Brownbear’s Secret AI Model</title>
  <style>
    /* ---------- Layout ---------- */
    body {
      font-family: 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      transition: background 0.3s ease, color 0.3s ease;
    }

    .container {
      padding: 32px;
      border-radius: 16px;
      max-width: 700px;
      width: 100%;
      text-align: center;
      transition: background 0.3s ease, color 0.3s ease;
    }

    /* ---------- Branding ---------- */
    .branding {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 20px;
    }

    .left-logo, .right-logo {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #4f46e5;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .left-logo:hover, .right-logo:hover {
      transform: scale(1.05);
      box-shadow: 0 0 10px rgba(79, 70, 229, 0.5);
    }

    h1 {
      flex: 1;
      font-size: 1.75rem;
      margin: 0;
    }

    /* ---------- Theme Toggle ---------- */
    #theme-toggle {
      background: none;
      border: 2px solid #4f46e5;
      color: #fbbf24;
      font-size: 1.4rem;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    #theme-toggle:hover {
      transform: scale(1.1);
      background: #4f46e5;
      color: #fff;
    }

    /* ---------- Form and Response ---------- */
    textarea {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: none;
      resize: vertical;
      margin-top: 15px;
      font-size: 1rem;
      color: #111827;
      box-sizing: border-box;
    }

    button.submit {
      margin-top: 15px;
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 8px;
      background: #4f46e5;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    button.submit:hover {
      background: #4338ca;
      transform: translateY(-1px);
    }

    #loading-indicator {
      margin-top: 10px;
      color: #94a3b8;
      display: none;
    }

    #response-area {
      background: #e2e8f0;
      color: #111827;
      padding: 16px;
      border-radius: 8px;
      margin-top: 20px;
      min-height: 120px;
      white-space: pre-wrap;
      text-align: left;
    }

    footer {
      margin-top: 20px;
      font-size: 0.85rem;
    }

    /* ---------- Responsive Tweaks ---------- */
    @media (max-width: 768px) {
      .left-logo, .right-logo { width: 50px; height: 50px; }
      h1 { font-size: 1.4rem; }
    }

    @media (max-width: 480px) {
      .branding { flex-direction: column; align-items: center; }
      .left-logo, .right-logo { width: 45px; height: 45px; }
      h1 { font-size: 1.2rem; margin: 8px 0; }
    }

    /* ---------- Theme Styling (Dark/Light) ---------- */
    :root[data-theme='dark'] body {
      background: linear-gradient(120deg, #0f172a, #1e293b);
      color: #e2e8f0;
    }

    :root[data-theme='dark'] .container {
      background: #1e293b;
      border: 1px solid #334155;
      box-shadow: 0 12px 24px rgba(0,0,0,0.3);
    }

    :root[data-theme='dark'] h1 { color: #fbbf24; }
    :root[data-theme='dark'] footer { color: #94a3b8; }

    :root[data-theme='light'] body {
      background: linear-gradient(120deg, #f3f4f6, #e5e7eb);
      color: #111827;
    }

    :root[data-theme='light'] .container {
      background: #ffffff;
      border: 1px solid #d1d5db;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }

    :root[data-theme='light'] h1 { color: #4f46e5; }
    :root[data-theme='light'] footer { color: #6b7280; }
  </style>
</head>

<body>
  <div class="container">
    <!-- Header branding with logos and theme toggle -->
    <div class="branding">
      <img class="left-logo" src="assets/brownbear-logo.png" alt="Left logo">
      <h1>Professor Brownbear’s Secret AI Model</h1>
      <button id="theme-toggle" aria-label="Toggle dark/light mode">🌙</button>
      <img class="right-logo" src="assets/brown.png" alt="Right logo">
    </div>

    <!-- Input form for AI prompts -->
    <form id="prompt-form">
      <textarea id="prompt-input" rows="4" placeholder="Ask Professor Brownbear’s AI anything..."></textarea>
      <button class="submit" type="submit">Consult the AI Oracle 🧠</button>
    </form>

    <div id="loading-indicator">The AI is pondering your question...</div>
    <div id="response-area">Your answer will appear here.</div>
    <footer>Powered by Google Gemini API – Full Stack XO Curriculum</footer>
  </div>

  <script>
    // ---------- THEME TOGGLE LOGIC ----------
    const toggleButton = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Apply stored preference or default to dark
    if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme);
      toggleButton.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    toggleButton.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      toggleButton.textContent = next === 'dark' ? '☀️' : '🌙';
    });

    // ---------- FORM SUBMISSION LOGIC ----------
    const form = document.getElementById('prompt-form');
    const input = document.getElementById('prompt-input');
    const responseArea = document.getElementById('response-area');
    const loading = document.getElementById('loading-indicator');
    const submitButton = document.querySelector('.submit');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const prompt = input.value.trim();
      if (!prompt) return;

      responseArea.textContent = '';
      loading.style.display = 'block';
      submitButton.disabled = true;

      try {
        const response = await fetch('/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        if (response.ok) {
          responseArea.textContent = data.text;
        } else {
          responseArea.textContent = "Error: " + (data.error || "Unknown issue");
        }
      } catch (err) {
        responseArea.textContent = "Network or server error.";
      } finally {
        loading.style.display = 'none';
        submitButton.disabled = false;
      }
    });
  </script>
</body>
</html>
`);
});

// --- BACKEND ROUTE / Gemini Proxy --------------------------------------------

app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).json({ error: "Prompt is required." });

  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  const apiUrl = API_URL_BASE + "?key=" + apiKey;

  try {
    let apiResponse;
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      apiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (apiResponse.ok) break; // success → exit loop

      // Wait exponentially longer each retry
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.log(`Retrying Gemini API in ${delay / 1000}s...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw new Error("Gemini API failed after 3 attempts");
      }
    }

    const result = await apiResponse.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      res.json({ text });
    } else {
      console.error("Unexpected Gemini API structure:", result);
      res.status(500).json({ error: "Unexpected response structure" });
    }

  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Internal Server Error while calling Gemini API" });
  }
});

// --- SERVER STARTUP -----------------------------------------------------------

app.listen(PORT, () => {
  console.log(`🚀 Professor Brownbear’s Secret AI Model running at http://localhost:${PORT}`);
});
