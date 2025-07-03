# Application Architecture

This is a Next.js application, which has a modern architecture that might be different from traditional web apps where the frontend and backend are completely separate. Here's a breakdown of where the "backend" logic lives:

## The "Backend" is Integrated

In this Next.js app, the backend isn't in a separate folder. Instead, server-side logic is integrated directly into the application structure.

### 1. AI Flows (`src/ai/flows/`)

-   **This is the core of your backend logic.**
-   All files in this directory contain functions that run **exclusively on the server**. This is enforced by the `'use server';` directive at the top of each file.
-   These "flows" are where the application communicates with the Google Generative AI models (like Gemini) to perform tasks like diagnosing plant diseases, getting weather forecasts, etc.
-   They also handle database interactions, like fetching and saving posts in the Farmer Community feature.

### 2. Server Components (`src/app/`)

-   By default, all components in Next.js's App Router (`src/app/`) are **Server Components**.
-   This means they run on the server to generate the initial HTML for a page. They can directly access the database or call AI flows. This is faster and more secure because sensitive data and operations never have to be exposed to the user's browser.

### 3. Database (`src/lib/firebase.ts`)

-   The file `src/lib/firebase.ts` contains the configuration to connect to your Firestore database.
-   However, the actual database queries (reading and writing data) are performed within the server-side AI Flows mentioned above. This keeps your database credentials and logic secure on the server.

## Summary

-   **Frontend (Client-side):** Components marked with `'use client';` (like `src/components/disease-diagnosis.tsx`) handle user interactions in the browser.
-   **Backend (Server-side):** The AI flows in `src/ai/flows/` and Server Components in `src/app/` handle the data processing, AI communication, and database operations.

This integrated approach is a powerful feature of Next.js that simplifies development by allowing you to write your frontend and backend logic in a more cohesive way.
