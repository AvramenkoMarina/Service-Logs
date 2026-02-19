#Service Logs Management App
A React + TypeScript application for managing vehicle service logs with draft support, auto-save functionality, filtering, sorting, and editing capabilities.

Features
📝 Service Log Form
Create new service logs
Form validation using Yup
Built with react-hook-form
Automatic draft saving (debounced)
Multiple draft support
Create a final service log from a draft
📂 Draft Management
Create draft
Delete draft
Clear all drafts
Active draft selection
Auto-save status indicator (Saving... / Draft saved)
📊 Service Logs Table
Search by:
providerId
carId
serviceOrder
Filter by:
Service type (Planned / Unplanned / Emergency)
Start date range
Sorting:
Provider
Service Order
Start Date
End Date
Pagination
Edit service log (dialog)
Delete service log

Tech Stack
React 18
TypeScript
Redux Toolkit
React Redux
react-hook-form
Yup
Material UI (MUI)
Vite
🚀 Getting Started
1️⃣ Install dependencies
npm install
2️⃣ Run development server
npm run dev
App will be available at:
http://localhost:5173
3️⃣ Build for production
npm run build
4️⃣ Preview production build
npm run preview
