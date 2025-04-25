# PTelligence: Physical Therapy Assistant AI

A full-stack app for generating PT rehab plans using AI.

---

## Features

- **Generate Recommendations**: Input patient details, symptoms, and goals to generate a rehabilitation plan.
- **Contraindications**: Identify exercises or actions to avoid based on the patient's condition.
- **Follow-Up Questions**: Ask follow-up questions to refine or clarify the AI's recommendations.
- **Interactive Chat**: Maintain a conversation history with the AI for better context.

---

## Tech Stack

### Frontend

- **React**: For building the user interface.
- **Vite**: For fast development and build processes.
- **Tailwind CSS**: For styling components.

### Backend

- **FastAPI**: For handling API requests and integrating with OpenAI's GPT-4 model.
- **OpenAI API**: For generating AI-driven recommendations and follow-ups.

---

## Prerequisites

- **Node.js** (v16 or later)
- **Python** (v3.9 or later)
- **OpenAI API Key**: Required for GPT-4 integration.
- **Environment Variables**:
  - Frontend: `REACT_APP_BACKEND_URL`
  - Backend: `OPENAI_API_KEY`

---

PTelligence/
├── client/ # Frontend code
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Main pages (e.g., PTIntakeUI.jsx)
│ │ └── App.jsx # Entry point for the React app
│ ├── public/ # Static assets
│ └── package.json # Frontend dependencies
├── server/ # Backend code
│ ├── main.py # FastAPI application
│ ├── requirements.txt # Backend dependencies
│ └── .env # Backend environment variables
└── [README.md](http://_vscodecontentref_/1) # Documentation
