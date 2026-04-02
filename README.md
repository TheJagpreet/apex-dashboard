# Apex Dashboard

A modern React dashboard for managing [apex-venv](https://github.com/TheJagpreet/apex-venv) sandbox environments.

![Black & Gold](https://img.shields.io/badge/theme-Black%20%26%20Gold-ECD06F?style=flat-square&labelColor=000000)

## Features

- **Dashboard Overview** — Live stats, server health, recent sandboxes at a glance
- **Sandbox Management** — List, search, filter, create, and destroy sandboxes
- **Built-in Terminal** — Execute commands inside sandboxes with color-coded output
- **File Operations** — Copy files to/from sandboxes
- **Real-time Status** — Polling-based live status updates for all sandboxes
- **Modern UI** — Material You design with dark theme, animations, and responsive layout

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **MUI v7** (Material UI) with custom dark theme
- **Framer Motion** for animations
- **Axios** for API communication
- **React Router** for SPA navigation
- **DM Sans** + **Space Mono** typography

## Getting Started

### Prerequisites

- Node.js 18+
- [apex-venv server](https://github.com/TheJagpreet/apex-venv) running on `localhost:8080`

### Install & Run

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

### Configuration

Set the API base URL via environment variable:

```bash
VITE_API_BASE_URL=http://your-server:8080 npm run dev
```

## Project Structure

```
src/
├── api/            # API client and TypeScript types
├── components/
│   └── layout/     # AppLayout with sidebar navigation
├── hooks/          # Custom React hooks for data fetching
├── pages/          # Dashboard, Sandboxes, CreateSandbox, SandboxDetail
└── theme/          # MUI theme configuration (Black #000 + Gold #ECD06F)
```
