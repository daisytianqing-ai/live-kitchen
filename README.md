# Gemini Live Kitchen Sous-Chef
    
    ## Project Overview
    The Gemini Live Kitchen Sous-Chef is a hands-free, voice-controlled kitchen assistant designed to guide users through recipes with real-time, multimodal interaction. It leverages Gemini's vision and voice capabilities to provide a seamless cooking experience, offering step-by-step instructions, safety alerts, and progress tracking.
    
    ## Key Features
    - **Hands-Free Voice Control**: Navigate recipes, control timers, and ask questions using voice commands.
    - **Real-Time Multimodal Interaction**: The assistant sees what you see and hears what you say, understanding ingredients and cooking progress through camera and microphone input.
    - **Safety Alerts**: Get timely alerts for potential hazards like unattended cooking or incorrect ingredient usage.
    - **Progress Tracking**: The assistant keeps track of your cooking steps and can provide summaries or next steps on demand.
    
    ## Tech Stack
    - Gemini 1.5 Flash Live API
    - React
    - TypeScript
    - Tailwind CSS
    - Web Audio API
    - Web Media API (Camera/Microphone)
    
    ## Architecture
    Below is a high-level architecture diagram illustrating the user interaction flow:
    ![Architecture Diagram](https://github.com/daisytianqing-ai/live-kitchen/blob/main/User%20Interaction%20with-2026-03-16-021824.png)
    
    ## Getting Started
    To get the Gemini Live Kitchen Sous-Chef running locally:
    
    1.  **Clone the repository:**
        ```bash
        git clone https://github.com/daisytianqing-ai/live-kitchen.git
        cd live-kitchen
        ```
    2.  **Install dependencies:**
        ```bash
        npm install
        ```
    3.  **Set up environment variables:**
        Create a `.env` file in the root directory and add your Gemini API key:
        ```
        VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
        ```
    4.  **Run the development server:**
        ```bash
        npm run dev
        ```
        Open your browser to the local address provided (usually `http://localhost:5173`).
    
    ## How to Test (For Judges)
    Once the application is running:
    
    1.  Click the "Start" button and allow camera/microphone access.
    2.  Try saying: "Let's start cooking".
    3.  When prompted, show ingredients like flour, eggs, or milk to the camera for the assistant to identify.
    4.  Follow the voice prompts and recipe steps provided by the assistant.
    
    
