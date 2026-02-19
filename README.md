# Service Logs Management App
A React + TypeScript application for managing vehicle service logs with draft support, auto-save functionality, filtering, sorting, and editing capabilities.

## Features
📝 Service Log Form
 - Create new service logs
 - Form validation using Yup
 - Built with react-hook-form
 - Automatic draft saving (debounced)
 - Multiple draft support
 - Create a final service log from a draft
   
📂 Draft Management
 - Create draft
 - Delete draft
 - Clear all drafts
 - Active draft selection
 - Auto-save status indicator (Saving... / Draft saved)
   
## Tech Stack
 - React 18
 - TypeScript
 - Redux Toolkit
 - React Redux
 - react-hook-form
 - Yup
 - Material UI (MUI)
 - Vite
   
🚀 Getting Started
- Install dependencies
  ```bash
   npm install
  ```
-  Run development server
   ```bash
   npm run dev
   ```
 - App will be available at:
   ```bash
   http://localhost:5173
   ```
 - Build for production
   ```bash
   npm run build
   ```
 - Preview production build
   ```bash
   npm run preview
   ```
