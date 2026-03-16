<h1 align="center">🧑‍🍳 Gemini Live Kitchen Sous-Chef</h1>

<p align="center">
  <strong>Hands-free, multimodal culinary guidance powered by Gemini 1.5 Flash Live.</strong>
</p>

<p align="center">
  <a href="https://aistudio.google.com/apps/e8ff3010-07c6-4169-89e5-c4c235cf08cd?showAssistant=true&showPreview=true">
    <img src="https://img.shields.io/badge/Live-Demo-red?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Live Demo">
  </a>
</p>

---

## 📖 Introduction
The **Gemini Live Kitchen Sous-Chef** is a real-time, voice-and-vision-activated assistant designed for the high-stakes environment of a home kitchen. By leveraging the **Gemini 1.5 Flash Live API**, it solves the "messy hands" dilemma, allowing chefs to advance recipes and receive safety warnings without ever touching a screen.

## ✨ Features
* **🎙️ Hands-Free Interaction:** Control the entire cooking flow using natural voice commands.
* **👁️ Multimodal Vision:** Show your ingredients to the camera for automatic recognition.
* **⚠️ Real-time Safety Alerts:** Proactive warnings about kitchen hazards (like knife safety).
* **📉 Progress Tracking:** Seamlessly move through steps with verbal confirmation.

## 🏗️ Architecture
The system operates on a low-latency multimodal loop between the browser and Google Cloud:

![Architecture Diagram](https://github.com/daisytianqing-ai/live-kitchen/blob/main/User%20Interaction%20with-2026-03-16-021824.png)

## 🛠️ Tech Stack
* **Language:** TypeScript
* **Framework:** React
* **AI Model:** Gemini 1.5 Flash Live API
* **Styling:** Tailwind CSS
* **Media:** Web Audio & Web Media APIs

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Google AI Studio API Key

### Installation & Setup
1.  **Clone the repo**
    ```bash
    git clone [https://github.com/daisytianqing-ai/live-kitchen.git](https://github.com/daisytianqing-ai/live-kitchen.git)
    cd live-kitchen
    ```
2.  **Install packages**
    ```bash
    npm install
    ```
3.  **Environment Config**
    Create a `.env` file:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```
4.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 🧪 Testing Instructions (For Judges)
1.  **Connect:** Click **Connect** and allow permissions.
2.  **Initialize:** Say *"Let's start cooking"* to trigger the AI.
3.  **Vision Test:** Show a vegetable to the camera and ask, *"What should I do with this?"*
4.  **Flow Test:** Say *"Next step"* to see the instructions update.
