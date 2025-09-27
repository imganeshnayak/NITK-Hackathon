# VibeChain - Botanical Traceability System 🌿

A blockchain-powered supply chain traceability platform for Ayurvedic herbs, ensuring authenticity, transparency, and sustainability from farm to consumer. Built for the Vibe Coding Hackathon.

![Status](https://img-shields.io/badge/Status-In_Progress-yellow)

## 🚀 Tech Stack

-   **Frontend:** React (with Vite)
-   **Styling:** Tailwind CSS v3
-   **Routing:** React Router v6

## ✨ Features Implemented (v0.4)

-   **Utility-First Styling:** Project uses Tailwind CSS for a fast, custom, and highly optimized design.
-   **Client-Side Routing:** `react-router-dom` handles navigation between pages.
-   **Modern Login Page:** A stunning, responsive login screen.
-   **Reusable Navbar Component:** A consistent navigation bar for the application.
-   **Dynamic Farmer Dashboard:** An interface for farmers to register batches.
-   **Fully Responsive Admin Dashboard:** A dashboard for admins to approve/reject batches. It cleverly displays data as a **table on desktops** and reflows into a **card list on mobile devices** for optimal user experience.

## 🏁 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd frontend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 📸 Screenshots

*Farmer Dashboard*


*Admin Dashboard (Desktop & Mobile)*

Fully Responsive Admin Dashboard: A dashboard for admins to approve/reject batches. It cleverly displays data as a table on desktops and reflows into a card list on mobile devices for optimal user experience.

Light/Dark Mode: A theme toggle allows users to switch between light and dark modes for comfortable viewing.

Persistent Theme: The user's theme choice is saved in their browser's localStorage for a consistent experience on return visits.

Dynamic Consumer Portal: A certificate-style page to display an herb's full provenance. It uses dynamic routing (/verify/:batchId) to show data for specific batches.

Provenance Timeline: An impressive visual timeline tracks the herb's journey from registration to verification, building consumer trust.