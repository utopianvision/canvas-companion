# 🚀 ClassMate: AI-Powered Academic Companion

## ✨ Overview

**ClassMate** is a comprehensive web application designed to significantly enhance the student learning experience. By providing **intelligent tools** for course management, **personalized study planning**, and seamless integration with existing academic platforms like **Canvas**, ClassMate empowers students to efficiently manage their academic journey and achieve their full potential. It leverages the power of **Google Gemini AI** to make studying smarter, not just harder.

-----

## 🔑 Key Features

| Feature | Description | Status |
| :--- | :--- | :--- |
| **Intelligent Dashboard** | Provides a clear, concise, at-a-glance overview of academic progress, including active courses, upcoming assignments, overdue items, and completed tasks. | Active |
| **Automated Study Plan Generation** | Leverages the **Google Gemini AI model** to create personalized study plans tailored to individual coursework, deadlines, and learning styles. | Active |
| **Seamless Canvas Integration** | Connects directly to your **Canvas** account to automatically import course information and assignment details. | Active |
| **Google Calendar Synchronization** | Offers the ability to sync important assignment deadlines and personalized study sessions directly with your **Google Calendar**. | Demonstration |
| **AI-Powered Tutoring Assistant** | Provides a chat-based interface for interacting with ClassMate AI, offering personalized tutoring and real-time study assistance. | Demonstration |
| **AI Notetaker** | Transcribes audio recordings (e.g., lectures or study sessions) into text, enabling quick and easy note-taking and review. | Demonstration |

-----

## 🛠️ Technologies

### Frontend

The client-side application is a modern, responsive, and highly interactive interface built with:

  * **React:** JavaScript library for building user interfaces.
  * **TypeScript:** Superset of JavaScript that adds static typing for better code quality.
  * **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
  * **Lucide React:** A library of beautiful and consistent icons.
  * **Google APIs:**
      * `gapi-script`: Google API client for browser-based JavaScript apps.
  * **Markdown Handling:**
      * `react-markdown`: React component to render Markdown content (e.g., from the AI Assistant).
      * `remark-gfm`: Remark plugin to support GitHub Flavored Markdown (GFM).

### Backend

The server-side application handles data processing, API integration, and AI logic, built with:

  * **Flask:** A lightweight Python WSGI web application framework.
  * **Flask-CORS:** Extension for handling Cross-Origin Resource Sharing (CORS).
  * **Google Generative AI:**
      * `google-generativeai`: Google Generative AI API for Python.
  * **Google APIs (Python):**
      * `google-api-python-client`
      * `google-auth-httplib2`
      * `google-auth-oauthlib` (Used for Calendar integration)
  * **Utilities:**
      * `SpeechRecognition`: Library for performing speech recognition (used in the AI Notetaker).

-----

## ⚙️ Getting Started

These instructions will guide you through setting up and running **ClassMate** on your local machine for development and testing.

### Prerequisites

Ensure you have the following installed on your system:

  * **Python 3.7+**
  * **Node.js 14+**
  * **npm 6+**
  * A **Google Cloud Platform (GCP)** project with the **Google Calendar API** and **Gemini API** enabled.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone [repository URL]
    cd canvas-companion
    ```

2.  **Set up the Backend (Flask):**

    ```bash
    python3 -m venv venv
    source venv/bin/activate # or venv\Scripts\activate on Windows
    pip install -r requirements.txt
    ```

3.  **Configure Google Cloud Credentials:**

      * Download your **OAuth 2.0 Client ID** JSON file (typically named `client_secret.json`) from the Google Cloud Console.
      * Set your **Gemini API Key** as an environment variable:
        ```bash
        export GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
        ```

4.  **Run the Flask Backend:**

    ```bash
    python app.py
    ```

5.  **Set up the Frontend (React):**

    ```bash
    cd src
    npm install
    ```

6.  **Configure Frontend Google Credentials:**

      * Update the relevant file (e.g., `src/pages/CalendarPage.tsx` or a configuration file) with your **Google Client ID** and **API Key** for the Calendar functionality.

7.  **Start the React Development Server:**

    ```bash
    npm run dev
    ```

### Accessing ClassMate

Open your web browser and navigate to `http://localhost:5173` to access the ClassMate application.
