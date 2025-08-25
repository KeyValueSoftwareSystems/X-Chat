<div align="center">
  <img src="mock-ui/assets/Clara.png" alt="Clara" width="150">
  <h1>Clara: Your AI-Powered Support Assistant</h1>
  <p>An intelligent, embeddable chat widget designed to elevate your customer experience.</p>
  <a href="https://drive.google.com/file/d/1rbcfxQFL8mfeNBLMsORUZwggnGPvG77c/view?usp=drive_link" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge" alt="Live Demo"/>
  </a>
</div>

## About the Project

This project is a comprehensive customer support solution featuring **Clara**, an AI-powered chat widget. It can be embedded on any website to provide instant assistance to users. The system is designed to handle user queries, escalate issues to a support team via Slack, and provide a seamless integration experience for developers.

## Siren Platform Integration

The backend heavily utilizes the **Siren** platform to orchestrate complex workflows:

- **Chat Behavior**: The Siren Chat Node is used to initiate and manage the conversational flow. It defines how the bot interacts with users and when to escalate to a human agent.
- **Slack Notifications**: When a user's query requires human intervention, a Siren workflow is triggered. This workflow sends a detailed notification to a designated Slack channel, allowing the support team to see the user's query and respond.
- **Email Notifications**: Siren is also used to send transactional emails. For example, when a support ticket is resolved, a webhook from Siren notifies the backend, which in turn sends an automated email to the user to inform them of the resolution.

## Architecture

The project is a monorepo composed of three main parts:

1. **`platform/agent`**: The backend service (Node.js/Express).
2. **`platform/client`**: The frontend application/dashboard (Next.js).
3. **`mock-ui`**: A mock user-facing website to demonstrate the chat widget.

## Features

- **Embeddable Chat Widget**: A self-contained chat widget that can be easily added to any website.
- **AI-Powered Support**: Clara, the AI bot, provides intelligent responses to user queries.
- **Email Capture**: Automatically detects and saves user email addresses provided in the chat.
- **Slack Integration**: Escalates complex queries to a support team in a designated Slack channel.
- **Real-time Updates**: Uses SSE to push messages from the server to the chat widget in real-time.
- **Easy Configuration**: A simple dashboard for getting the widget embed code and configuring integrations.

## Setup and Running the Project

Follow these steps to get the project running locally.

### Prerequisites

- Node.js and npm (or yarn/pnpm).
- Access to Siren and an API Key.
- An OpenAI API Key.

### Environment Variables

You will need to create a `.env` file in the `platform/agent` directory with the following variables:

```env
SIREN_API_KEY=your_siren_api_key
SIREN_API_BASE_URL=https://api.siren.io
OPENAI_API_KEY=your_openai_api_key

# Siren Workflow Configuration
CHAT_WORKFLOW_NAME="Siren Agent Chat"
CHAT_WORKFLOW_SLACK_CHANNEL="#support-alerts"
CHAT_NODE_ID="chat-user-message"
```

### Installation

1. **Install root dependencies** (if any, for monorepo tools):

   ```bash
   npm install
   ```

2. **Install Backend dependencies**:

   ```bash
   cd platform/agent
   npm install
   ```

3. **Install Frontend dependencies**:

   ```bash
   cd platform/client
   npm install
   ```

### Running the Application

1. **Start the Backend Server**:
   - Navigate to the backend directory and run the start command.
   - The server will run on `http://localhost:3001`.

   ```bash
   cd platform/agent
   npm run dev
   ```

2. **Start the Frontend/Client Application**:
   - Navigate to the client directory and run the start command.
   - The client dashboard will be available at `http://localhost:3000`.

   ```bash
   cd platform/client
   npm run dev
   ```

3. **View the Mock UI with the Chat Widget**:
   - Simply open the `mock-ui/index.html` file in your web browser.
   - This page demonstrates the embedded chat widget connecting to the local backend.

## Using the Chat Widget

1. Navigate to the client dashboard (`http://localhost:3000/integrations`).
2. Copy the script tag provided.
3. Paste this script tag into the HTML of any website to embed the Clara support bot.