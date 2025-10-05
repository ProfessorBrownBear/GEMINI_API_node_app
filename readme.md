## 🧠 Professor Brownbear’s Secret AI Model

*A Teaching Lab for ExpressJS + Gemini API Integration*

### 🚀 Overview

**Professor Brownbear’s Secret AI Model** is a full-stack Node.js + Express web application that integrates with **Google’s Gemini API** (Generative Language API).

It’s designed as a **teaching lab** to help new developers understand:

* How to securely connect to an external AI API.
* How front-end forms send POST requests to Express routes.
* How to use **async/await**, **fetch()**, and **.env** for configuration.
* How to build modern frontends with **dark/light themes** and responsive design.

This app demonstrates the complete flow of data:

```
User input → Express server → Gemini API → Response → Browser display
```

---

## 🧩 Features

✅ Built with **Express.js** (backend)

✅ Secure environment variables via **dotenv**

✅ Uses Node 22+ **native fetch()** (no need for node-fetch)

✅ Retry logic with exponential backoff for reliability

✅ Responsive layout with **light/dark mode toggle**

✅ Uses only standard Node.js modules — no frontend frameworks required

✅ Educational inline comments for classroom teaching

---

## ⚙️ Installation & Setup

### 1️⃣ Clone or Create Project

```bash
git clone https://github.com/yourusername/professor-brownbear-gemini-lab.git
cd professor-brownbear-gemini-lab
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Get a Gemini API Key

1. Go to the official Gemini API Console:
   👉 [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account.
3. Create a new API key.
4. Copy it — we’ll add it to your `.env` file next.

---

## 🔐 4️⃣ Create a `.env` File

Create a file named `.env` in your project root:

```bash
touch .env
```

Then open it and add your API key like this:

```bash
GEMINI_API_KEY=your_api_key_here
```

⚠️ **Never commit this file to GitHub** — `.env` is listed in `.gitignore` for security.

---

## 🧮 5️⃣ Run the App

Start the Express server:

```bash
npm start
```

You should see:

```
🚀 Professor Brownbear’s Secret AI Model running at http://localhost:3000
```

Then open your browser and navigate to:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🧪 6️⃣ How to Use

1. Type a question or prompt into the text area, for example:

   ```
   Write a short poem about Node.js in the style of Shakespeare.
   ```
2. Click **“Consult the AI Oracle 🧠”**.
3. Wait a few seconds — the app sends your text to the **Gemini API**.
4. The AI’s answer appears below the form.
5. Use the 🌙 / ☀️ button in the header to toggle dark/light mode.

---

## 🧬 Application Architecture

```
project-root/
│
├── express_gemini_app.js   # Main Express server file
├── .env                    # Your Gemini API key (not committed)
├── assets/
│   ├── brownbear-logo.png  # Professor Brownbear branding
│   └── brown.png           # Secondary branding image
├── package.json
└── README.md

## 🧭 How It Works (Step by Step)

### 1️⃣ User Interaction

* The user types a prompt into the form and submits it.
* A **POST** request is sent to `/generate` with the prompt text.

### 2️⃣ Express Server Logic

* The `/generate` route in `express_gemini_app.js` constructs a request payload.
* It calls the Gemini API using `fetch()` with the user’s prompt.

### 3️⃣ Exponential Backoff

If the Gemini API doesn’t respond successfully, the server waits:

```
1 second → 2 seconds → 4 seconds
```

and retries up to **3 times** before returning an error.

### 4️⃣ Gemini API Response

* Gemini returns a JSON object containing generated text.
* The app extracts `result.candidates[0].content.parts[0].text`.

### 5️⃣ Display on Frontend

* The AI’s text is sent back as JSON.
* The browser displays it in the `<div id="response-area">`.

---

## 🎨 Theming & UX

The header includes:

* Two logos (left and right)
* A title: *“Professor Brownbear’s Secret AI Model”*
* A **theme toggle button** 🌙 / ☀️

Theme preferences are saved in `localStorage`, so the chosen mode persists between sessions.

---

## ⚠️ Troubleshooting

| Issue                           | Cause                         | Solution                        |
| ------------------------------- | ----------------------------- | ------------------------------- |
| `Error: Missing GEMINI_API_KEY` | No `.env` file or missing key | Create `.env` with your API key |
| `fetch is not a function`       | Node version too old          | Upgrade to Node 22+             |
| API request fails               | Invalid API key or rate limit | Check key or retry later        |
| JSON parse error                | API returned unexpected data  | Log full response for debugging |

---

## 🧰 Commands

| Command                      | Description                                 |
| ---------------------------- | ------------------------------------------- |
| `npm install`                | Install dependencies                        |
| `npm start`                  | Start Express server                        |
| `npm run dev`                | (optional) Run with nodemon for live reload |
| `node express_gemini_app.js` | Directly run the server                     |

---

## 📘 Learning Objectives

Students completing this lab will:

* Understand environment variables and `.env` management.
* Implement secure API communication patterns.
* Work with Express routing and middleware.
* Handle async fetch requests and parse JSON responses.
* Apply front-end state persistence (`localStorage`).
* Style responsive UIs and handle themes dynamically.

---

## 🧑‍🏫 Professor’s Note

This lab is part of the **Full Stack XO Curriculum** —
the next generation of full-stack education integrating **probabilistic AI controllers** into the traditional **MVC** pattern.

> “In the coming years, your controllers won’t just process logic —
> they’ll *think probabilistically.*
> This lab is your first step into that future.”

---

## 🪪 License

MIT © 2025 Professor Brown Bear (Peter Sigurdson)
Educational use and remix permitted for classroom instruction.

